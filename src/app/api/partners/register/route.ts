import { NextResponse } from 'next/server'
import { digiseller } from '@/lib/digiseller'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email } = registerSchema.parse(body)

        const result = await digiseller.registerPartner(email)

        if (result.retval !== 0) {
            return NextResponse.json(
                { error: result.desc || 'Registration failed' },
                { status: 400 }
            )
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Partner registration error:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
