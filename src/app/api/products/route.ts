import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parse query parameters
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const sort = searchParams.get('sort') || 'createdAt'
        const order = searchParams.get('order') || 'desc'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')

        // Build where clause
        const where: Record<string, unknown> = {
            isActive: true,
        }

        if (category) {
            where.category = category
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ]
        }

        if (minPrice || maxPrice) {
            where.price = {}
            if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
            if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
        }

        // Build orderBy based on sort type
        let orderBy: Record<string, string> | Record<string, string>[] = {}

        if (sort === 'smart' || sort === 'recommended') {
            // Smart ranking - use pre-calculated score
            orderBy = { rankingScore: 'desc' }
        } else if (sort === 'price') {
            orderBy = { price: order }
        } else if (sort === 'price-asc') {
            orderBy = { price: 'asc' }
        } else if (sort === 'price-desc') {
            orderBy = { price: 'desc' }
        } else if (sort === 'popular') {
            orderBy = [{ salesCount: 'desc' }, { digisellerSalesCount: 'desc' }]
        } else if (sort === 'new') {
            orderBy = { createdAt: 'desc' }
        } else {
            // Default: smart ranking
            orderBy = { rankingScore: 'desc' }
        }

        // Get total count
        const total = await prisma.product.count({ where })

        // Get products with pagination
        const products = await prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
        })

        return NextResponse.json({
            success: true,
            data: {
                items: products,
                total,
                page,
                pageSize: limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

// POST - Create new product (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const product = await prisma.product.create({
            data: {
                title: body.title,
                description: body.description,
                shortDesc: body.shortDesc,
                price: body.price,
                discountPrice: body.discountPrice,
                category: body.category,
                tags: body.tags || [],
                imageUrl: body.imageUrl,
                digisellerProductId: body.digisellerProductId,
                isActive: body.isActive ?? true,
            },
        })

        return NextResponse.json({ success: true, data: product }, { status: 201 })
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        )
    }
}
