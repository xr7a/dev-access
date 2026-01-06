import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { digiseller } from '@/lib/digiseller'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const productId = (await params).id

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

        try {
            const liveData = await digiseller.getProduct(product.digisellerProductId)

            if (!liveData) {
                return NextResponse.json({
                    price: Number(product.price),
                    currency: 'RUB',
                    isAvailable: true,
                    checkError: true
                })
            }

            return NextResponse.json({
                price: liveData.price,
                currency: liveData.currency,
                isAvailable: true,
                digisellerId: product.digisellerProductId
            })
        } catch {
            return NextResponse.json({
                price: Number(product.price),
                currency: 'RUB',
                isAvailable: true,
                checkError: true
            })
        }

    } catch {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}

