import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { digiseller } from '@/lib/digiseller'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const productId = (await params).id

        // 1. Get product from local DB to find its Digiseller ID
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                digisellerProductId: true,
                price: true,
            }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // 2. Fetch live details from Digiseller
        // We use getProduct to get simple info (price/currency)
        // Or getProductDetails for valid status.
        // getProduct is lighter.

        let liveData = null
        try {
            liveData = await digiseller.getProduct(product.digisellerProductId)
        } catch (e) {
            console.error('Failed to fetch live data', e)
            // Fallback to local data if API fails
            return NextResponse.json({
                price: Number(product.price),
                currency: 'RUB', // Assuming RUB as default for local
                isAvailable: true,
                checkError: true
            })
        }

        return NextResponse.json({
            price: liveData.price,
            currency: liveData.currency,
            isAvailable: true, // Digiseller API usually throws or returns null if hidden/deleted
            digisellerId: product.digisellerProductId
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
