import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { digiseller } from '@/lib/digiseller'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    try {
        // Get product from DB
        const product = await prisma.product.findUnique({
            where: { id },
            select: { digisellerProductId: true, price: true }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Fetch full details from Digiseller (includes options)
        const details = await digiseller.getProductDetails(Number(product.digisellerProductId))

        if (!details) {
            return NextResponse.json({
                price: Number(product.price),
                currency: 'RUB',
                options: []
            })
        }

        // Extract options from Digiseller response
        // API structure: options have 'label' for display, variants have 'text' and 'value'
        const rawOptions = (details as any).options || []
        const options = rawOptions
            .filter((opt: any) => opt && opt.label) // Use label, not name
            .map((opt: any) => ({
                id: opt.id,
                name: opt.label, // Display name is in 'label' field
                type: opt.type || (opt.variants ? 'select' : 'text'),
                required: opt.required === 1 || opt.required === true,
                comment: opt.comment,
                variants: opt.variants?.filter((v: any) => v && v.value != null).map((v: any) => ({
                    id: v.value, // ID is in 'value' field
                    name: v.text, // Display name is in 'text' field
                    rate: v.modify_value,
                    modifyValue: v.modify_value || 0, // Price modifier
                    isDefault: v.default === 1
                }))
            }))

        // Extract preview images
        const previewImages = (details as any).preview_imgs?.map((img: any) => ({
            id: img.id,
            url: img.url,
            width: img.width,
            height: img.height
        })) || []

        return NextResponse.json({
            price: details.price || Number(product.price),
            currency: details.currency || 'RUB',
            options,
            images: previewImages
        })
    } catch (error) {
        console.error('[API] Error fetching product options:', error)
        return NextResponse.json(
            { error: 'Failed to fetch product options' },
            { status: 500 }
        )
    }
}
