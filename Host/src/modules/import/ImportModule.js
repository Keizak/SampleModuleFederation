import React, { lazy, Suspense } from 'react'
import { ErrorBoundary } from '../../utils/lib/ErrorBoundary'

// Lazy and ErrorBoundary are optional. Made for convenience

const ImportedModuleLazy = lazy(async () => await import('ImportedNameInRescriptHost/MicroFrontExportedNameInRescript'))

const RemoteFactory = JSX => (
    <ErrorBoundary>
        <Suspense fallback={'Load'}>{JSX}</Suspense>
    </ErrorBoundary>
)

export const ImportedModule = props => RemoteFactory(<ImportedModuleLazy {...props} />)
