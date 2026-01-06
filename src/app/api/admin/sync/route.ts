import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { syncProductsFromDigiseller, updateAllRankingScores } from '@/lib/sync'

// POST - Trigger manual sync (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const action = searchParams.get('action') || 'sync'

        if (action === 'ranking') {
            // Only update ranking scores
            const updated = await updateAllRankingScores()
            return NextResponse.json({
                success: true,
                message: `Updated ranking for ${updated} products`,
            })
        }

        // Full sync from Digiseller
        const result = await syncProductsFromDigiseller()

        return NextResponse.json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error('Sync error:', error)
        return NextResponse.json(
            { success: false, error: 'Sync failed' },
            { status: 500 }
        )
    }
}

// GET - Check sync status
export async function GET() {
    const lastSync = await prisma.product.findFirst({
        where: { digisellerSyncedAt: { not: null } },
        orderBy: { digisellerSyncedAt: 'desc' },
        select: { digisellerSyncedAt: true },
    })

    const totalProducts = await prisma.product.count()
    const syncedProducts = await prisma.product.count({
        where: { digisellerSyncedAt: { not: null } },
    })

    return NextResponse.json({
        success: true,
        data: {
            lastSyncAt: lastSync?.digisellerSyncedAt || null,
            totalProducts,
            syncedProducts,
        },
    })
}

import prisma from '@/lib/prisma'
