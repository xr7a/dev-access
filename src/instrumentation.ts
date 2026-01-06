export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Only run on the server side
        // In dev mode, this might run twice because of the double-compilation of Next.js features
        if (process.env.NEXT_MANUAL_SIG_HANDLE) {
            // This flag is often present in the actual next start process
        }

        console.log('[Instrumentation] Registering background tasks...')

        // Prevent setting up multiple intervals if HMR triggers re-registration (mostly for dev)
        if (!(global as any).__SYNC_INTERVAL_SET) {
            (global as any).__SYNC_INTERVAL_SET = true

            // Schedule Sync every hour (3600000 ms)
            // Initial delay to let the server start up properly
            setTimeout(() => {
                console.log('[Cron] Starting background sync loop (every 1 minute)...')

                // We import dynamically to avoid build-time ciruclar dependency issues
                const runSync = async () => {
                    try {
                        const { syncProductsFromDigiseller } = await import('@/lib/sync')
                        console.log('[Cron] Triggering sync...')
                        const result = await syncProductsFromDigiseller()
                        console.log('[Cron] Sync result:', result)
                    } catch (err) {
                        console.error('[Cron] Sync failed:', err)
                    }
                }

                // Run immediately (optional, better to wait)
                // runSync()

                // Interval
                setInterval(runSync, 60 * 1000) // 1 minute
            }, 10000)
        }
    }
}
