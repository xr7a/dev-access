import { NextResponse } from 'next/server'
import { digiseller } from '@/lib/digiseller'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(req.url)
        const type = (searchParams.get('type') as 'all' | 'good' | 'bad') || 'all'
        const page = parseInt(searchParams.get('page') || '1')

        // Digiseller product ID is needed. 
        // We assume params.id is the LOCAL database ID or Digiseller ID?
        // In our page we use local ID, so we need to fetch product to get digiseller ID?
        // OR we store digiseller ID as the main ID? 
        // Let's check schema. We have digisellerProductId on Product model.

        // However, usually we pass the digiseller ID directly to this route if it's strictly for Digiseller proxy 
        // OR we lookup. Let's lookup to be safe if params.id is UUID.
        // But for simplicity, let's assume the frontend passes the correct Digiseller ID 
        // OR we update the route to lookup. 

        // Wait, the Product details page matches params.id which might be UUID.
        // So we strictly need to lookup. But importing prisma here adds latency.
        // Let's trust the frontend to pass the Digiseller ID as a query param or 
        // handle it in the Page (server component) and pass explicitly to child.

        // Better: This route /api/products/[id]/reviews will assume [id] is the Digiseller Product ID.
        // The frontend component will receive digisellerId prop.

        const productId = parseInt(id)
        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
        }

        const reviews = await digiseller.getReviews(productId, type, page)

        return NextResponse.json(reviews)
    } catch (error) {
        console.error('Reviews error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        )
    }
}
