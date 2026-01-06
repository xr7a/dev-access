import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { digiseller } from '@/lib/digiseller'
import type { DigisellerWebhookPayload } from '@/types'

const REFERRAL_COMMISSION_RATE = parseFloat(process.env.REFERRAL_COMMISSION_RATE || '0.15')

export async function POST(request: NextRequest) {
    try {
        const body: DigisellerWebhookPayload = await request.json()

        // Verify webhook signature
        if (!digiseller.verifyWebhookSignature(body)) {
            console.error('Invalid webhook signature')
            return NextResponse.json(
                { success: false, error: 'Invalid signature' },
                { status: 401 }
            )
        }

        // Find order by invoice ID
        const order = await prisma.order.findUnique({
            where: { digisellerInvoiceId: body.invoice_id },
            include: { items: true },
        })

        if (!order) {
            console.error('Order not found for invoice:', body.invoice_id)
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            )
        }

        // Update order status to PAID
        await prisma.order.update({
            where: { id: order.id },
            data: {
                status: 'PAID',
                paymentMethod: 'digiseller',
            },
        })

        // Update product sales counts
        for (const item of order.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { salesCount: { increment: item.quantity } },
            })
        }

        // Process referral commission if applicable
        if (order.referralCode) {
            const referrer = await prisma.user.findUnique({
                where: { referralCode: order.referralCode },
            })

            if (referrer) {
                const commission = Number(order.totalAmount) * REFERRAL_COMMISSION_RATE

                // Update referrer balance
                await prisma.user.update({
                    where: { id: referrer.id },
                    data: { balance: { increment: commission } },
                })

                // Update or create referral stats for today
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                await prisma.referralStat.upsert({
                    where: {
                        userId_date: {
                            userId: referrer.id,
                            date: today,
                        },
                    },
                    update: {
                        conversions: { increment: 1 },
                        earned: { increment: commission },
                    },
                    create: {
                        userId: referrer.id,
                        conversions: 1,
                        earned: commission,
                        date: today,
                    },
                })

                console.log(`Referral commission of ${commission} credited to user ${referrer.id}`)
            }
        }

        console.log(`Order ${order.id} marked as PAID`)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json(
            { success: false, error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}
