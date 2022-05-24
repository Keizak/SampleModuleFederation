<h1 style="color: #8c7fff"> Instructions for setting up the federation module Application </h1>

# <span style="border-bottom:3px solid green"> 1. Getting Started with Create React App </span>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).</br>

- If you already have an application ready, check the dependencies, we need the react-scripts package, > v5, if your
  version is lower, I suggest doing yarn add react-sripts@latest

# <span style="border-bottom:3px solid green"> 2. Adding @rescripts/cli package  </span>

- yarn add @rescripts/cli
- Let's rewrite scripts in package.json </br>
  "start": "react-scripts start" ---- > "start": "rescripts start" </br>
  "build": "react-scripts build" ---- > "build": "rescripts build"

# <span style="border-bottom:3px solid green"> 3. Setting up configs  </span>

- Create .rescriptsrc.js in root directory
- Add this code to file <br/>
- <div>
<code>const {container: { ModuleFederationPlugin }} = require('webpack')
// We take the name and dependencies for the project
const { name, dependencies: deps } = require('./package.json')
const path = require("path");

// We describe what our application will receive and give
const modules = {
imported: {},
exported: {
// Specify the path to the final module
"./AnyNameHere": path.resolve(__dirname, 'src/modules/export/ExportModule'),
},
}

// We're injecting an additional plugin in the CRA
const addPlugins = config => {
config.plugins.unshift(
new ModuleFederationPlugin({
name,
...deps,
// We specify common libraries, for not repeating them in a common bundle
shared: {
react: {
// This hint only allows a single version of the shared module in the shared scope
singleton: true,
},
'react-dom': {
singleton: true,
},
},
// File with source js for host
filename: 'remoteEntry.js',
// The modules that we give
exposes: modules.exported,
// The modules that we receive
remotes: modules.imported,
})
)
return config
}

const overrideSplitChunksName = config => ({
...config,
optimization: {
...config.optimization,
splitChunks: {
...config.optimization.splitChunks,
name: false,
},
},
})

function compose(...functions) {
if (functions.length === 0) {
return arg => arg
}

if (functions.length === 1) {
return functions[0]
}

return functions.reduce(
(a, b) =>
(...args) =>
a(b(...args))
)
}

const overrideConfig = config => compose(addPlugins, overrideSplitChunksName)(config)

// Your user config
module.exports = [
config => {
const mode = 'development'
const publicPath = `//localhost:3001/`
console.log(mode)
config.mode = mode
config.output.publicPath = publicPath
return overrideConfig(config)
},
]
</code>

# <span style="border-bottom:3px solid green"> 4. Create structure in src  </span>

- Create index.ts with this code</br>
<code>
// This import syntax is required for use with Webpack 5 Module Federation when we use exposes module</br>
  // @ts-ignore</br>
  void import('./index.tsx')
</code>

- Create folders for modules. In our case, src/modules/export</br>
- Exports files (In export, we do a normal export)</br>
<code>
const ExportModule = props => <App {...props}/> </br>
export default ExportModule
</code>

Import files (In the import we make a request for the module and then we do its processing or no)
<code>
import React, { lazy, Suspense } from 'react' </br>
import { ErrorBoundary } from '../../utils/lib/ErrorBoundary'

// Lazy and ErrorBoundary are optional. Made for convenience

const ImportedModuleLazy = lazy(async () => await import('ImportedNameInRescriptsHost/ExportedNameInRescritsMicroFront'))

const RemoteFactory = JSX => (
<ErrorBoundary>
<Suspense fallback={'Load'}>{JSX}</Suspense>
</ErrorBoundary>
)

export const ImportedModule = props => RemoteFactory(<ImportedModuleLazy {...props} />)
</code>

# <span style="border-bottom:3px solid green"> 5. Add Add script loading in html  </span>
- add in public/index.html script . Microfront source file path, see rescripts</br>
<code>
// \<*script src="http://localhost:3001/remoteEntry.js"></script>*
</code>