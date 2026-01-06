import { NextRequest, NextResponse } from 'next/server'
import { digiseller } from '@/lib/digiseller'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
        return NextResponse.json({ error: 'productId required' }, { status: 400 })
    }

    try {
        const details = await digiseller.getProductDetails(Number(productId))

        // Return raw response to debug
        return NextResponse.json({
            raw: details,
            options: (details as any)?.options,
            add_options: (details as any)?.add_options,
            texts: (details as any)?.texts,
            extra: (details as any)?.extra,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
