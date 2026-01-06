import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { digiseller } from '@/lib/digiseller'

interface OrderItem {
    productId: string
    digisellerProductId: string
    quantity: number
    price: number
}

interface CreateOrderBody {
    email: string
    items: OrderItem[]
    totalAmount: number
    referralCode?: string
    promoCode?: string
}

export async function POST(request: NextRequest) {
    try {
        const body: CreateOrderBody = await request.json()

        // Validate items
        if (!body.items || body.items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No items in order' },
                { status: 400 }
            )
        }

        // Create order in database
        const order = await prisma.order.create({
            data: {
                email: body.email,
                totalAmount: body.totalAmount,
                status: 'PENDING',
                referralCode: body.referralCode,
                items: {
                    create: body.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: true,
            },
        })

        // For single product orders, create Digiseller invoice
        // For multiple products, we need to handle differently (cart functionality)
        let paymentUrl = null

        if (body.items.length === 1) {
            try {
                const invoice = await digiseller.createInvoice({
                    productId: body.items[0].digisellerProductId,
                    email: body.email,
                    amount: body.totalAmount,
                    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/success?orderId=${order.id}`,
                    failUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/failed?orderId=${order.id}`,
                    partnerUid: body.referralCode,
                })

                // Update order with invoice ID
                await prisma.order.update({
                    where: { id: order.id },
                    data: { digisellerInvoiceId: invoice.invoiceId },
                })

                paymentUrl = invoice.invoiceUrl
            } catch (invoiceError) {
                console.error('Failed to create Digiseller invoice:', invoiceError)
                // Continue without payment URL - order is still created
            }
        } else {
            // For multiple products, redirect to Digiseller cart or use a different approach
            // For now, we'll just create the order and let the user know
            console.log('Multiple products in cart - Digiseller cart integration needed')
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                paymentUrl,
            },
        })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        )
    }
}

// GET - List orders (for admin or user)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')
        const status = searchParams.get('status')

        const where: Record<string, unknown> = {}
        if (email) where.email = email
        if (status) where.status = status

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ success: true, data: orders })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}
