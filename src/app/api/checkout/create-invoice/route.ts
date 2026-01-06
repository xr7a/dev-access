import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { digiseller } from '@/lib/digiseller'

interface CheckoutRequest {
    productId: string
    digisellerProductId: string
    email: string
    options?: { id: number; value: string }[]
}

export async function POST(request: NextRequest) {
    try {
        const body: CheckoutRequest = await request.json()
        const { productId, digisellerProductId, email, options } = body

        if (!email) {
            return NextResponse.json({ error: 'Email обязателен' }, { status: 400 })
        }

        // Get product to validate it exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { title: true }
        })

        if (!product) {
            return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
        }

        // Build payment URL params
        const params = new URLSearchParams({
            id_d: digisellerProductId,
            email: email,
            lang: 'ru-RU',
        })

        // If there are options, call Digiseller API to get id_po
        if (options && options.length > 0) {
            const idPo = await digiseller.initParameters(
                Number(digisellerProductId),
                options
            )

            if (idPo) {
                // Add id_po to payment URL - this tells Digiseller which options were selected
                params.append('id_po', idPo)
                console.log(`[Checkout] Got id_po: ${idPo} for product ${digisellerProductId}`)
            } else {
                console.warn(`[Checkout] Could not get id_po for product ${digisellerProductId}, options may not be pre-filled`)
            }
        }

        const paymentUrl = `https://oplata.info/asp2/pay.asp?${params.toString()}`

        console.log(`[Checkout] Generated payment URL: ${paymentUrl}`)

        return NextResponse.json({
            paymentUrl
        })
    } catch (error: any) {
        console.error('[API] Error creating checkout:', error)
        return NextResponse.json(
            { error: error.message || 'Ошибка создания заказа' },
            { status: 500 }
        )
    }
}
