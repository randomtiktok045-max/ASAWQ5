'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body className="p-4 bg-white text-black">
                <div className="flex flex-col items-center justify-center min-h-screen text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
                    <div className="bg-gray-100 p-4 rounded-lg mb-6 max-w-full overflow-auto text-left w-full">
                        <p className="font-mono text-sm break-all">{error.message}</p>
                        {error.stack && (
                            <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">{error.stack}</pre>
                        )}
                    </div>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
