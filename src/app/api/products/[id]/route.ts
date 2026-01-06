import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET single product
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params

        const product = await prisma.product.findUnique({
            where: { id },
        })

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: product })
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}

// PUT - Update product (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()

        const product = await prisma.product.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                shortDesc: body.shortDesc,
                price: body.price,
                discountPrice: body.discountPrice,
                category: body.category,
                tags: body.tags,
                imageUrl: body.imageUrl,
                digisellerProductId: body.digisellerProductId,
                isActive: body.isActive,
            },
        })

        return NextResponse.json({ success: true, data: product })
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update product' },
            { status: 500 }
        )
    }
}

// DELETE - Delete product (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params

        await prisma.product.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: 'Product deleted' })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}
