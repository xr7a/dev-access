import { NextRequest, NextResponse } from 'next/server'
import { syncProductsFromDigiseller } from '@/lib/sync'

// This endpoint is called by external cron service (e.g., Vercel Cron, GitHub Actions)
// Should be protected by a secret token

const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
    // Verify authorization
    const authHeader = request.headers.get('Authorization')

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        console.log('[Cron] Starting hourly product sync...')
        const result = await syncProductsFromDigiseller()

        return NextResponse.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error('[Cron] Sync error:', error)
        return NextResponse.json(
            { success: false, error: 'Sync failed' },
            { status: 500 }
        )
    }
}

// Also support POST for flexibility
export { GET as POST }
