import { NextResponse } from 'next/server'
import { digiseller } from '@/lib/digiseller'
import { z } from 'zod'

const verifySchema = z.object({
    code: z.string().min(10, 'Code is too short'),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { code } = verifySchema.parse(body)

        const result = await digiseller.findPaymentByCode(code)

        if (result.retval !== 0) {
            return NextResponse.json(
                { error: 'Payment not found or code is invalid' },
                { status: 404 }
            )
        }

        // If found, fetch detailed info to get product name
        // The findPaymentByCode returns limited info, so let's get full info if needed
        // but result already has id_goods, amount, email.
        // Let's return what we have first.

        return NextResponse.json(result)
    } catch (error) {
        console.error('Payment verification error:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
