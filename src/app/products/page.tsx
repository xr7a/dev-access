import { Suspense } from 'react'
import { ProductGrid, ProductFilters } from '@/components/products'
import { Skeleton } from '@/components/ui'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { cookies } from 'next/headers'
import { getDictionary, Locale } from '@/lib/dictionary'
import type { Metadata } from 'next'

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate dynamic metadata based on search/category
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams
    const category = typeof params.category === 'string' ? params.category : undefined
    const search = typeof params.search === 'string' ? params.search : undefined

    // Get category name if filtering by category
    let categoryName = ''
    if (category) {
        const cat = await prisma.category.findFirst({
            where: { slug: category },
            select: { name: true }
        })
        categoryName = cat?.name || category
    }

    const baseTitle = 'Каталог цифровых товаров'
    const title = category
        ? `${categoryName} - Купить в DevAccess`
        : search
            ? `Поиск: "${search}" - DevAccess`
            : baseTitle

    const description = category
        ? `Купить ${categoryName.toLowerCase()} в DevAccess. Подписки, ключи, аккаунты с мгновенной доставкой.`
        : 'Каталог цифровых товаров: подписки на нейросети, ключи к программам, аккаунты сервисов. Мгновенная доставка после оплаты.'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
        alternates: {
            canonical: category ? `/products?category=${category}` : '/products',
        },
    }
}

// Categories for filter
async function getCategories(lang: 'ru' | 'en') {
    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
    })

    // If no categories in DB yet, return empty (sync will fill it)
    if (categories.length === 0) {
        return []
    }

    return categories.map((cat) => ({
        id: cat.id,
        name: cat.name, // The Sync process saves the localized name from Digiseller here (usually RU)
        slug: cat.slug
    }))
}

// Map database product to UI product type
function mapProduct(p: any, lang: 'ru' | 'en') {
    return {
        id: p.id,
        title: p.title,
        description: p.description,
        shortDesc: p.shortDesc,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
        category: p.category,
        categorySlug: p.category,
        tags: p.tags,
        imageUrl: p.imageUrl,
        digisellerProductId: p.digisellerProductId,
        isActive: p.isActive,
        salesCount: p.salesCount + (p.digisellerSalesCount || 0),
        rankingScore: p.rankingScore,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        promotionLevel: p.promotionLevel
    }
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams
    const cookieStore = await cookies()
    const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'ru') as Locale
    const dict = await getDictionary(lang)

    const category = typeof params.category === 'string' ? params.category : undefined
    const search = typeof params.search === 'string' ? params.search : undefined
    const sort = typeof params.sort === 'string' ? params.sort : 'smart'
    const page = Number(typeof params.page === 'string' ? params.page : '1') || 1
    const limit = 20

    // Build Prisma query
    const where: Prisma.ProductWhereInput = {
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

    // Sort strategy
    let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = {}

    if (sort === 'popular') {
        orderBy = [{ salesCount: 'desc' }, { digisellerSalesCount: 'desc' }]
    } else if (sort === 'price-asc') {
        orderBy = { price: 'asc' }
    } else if (sort === 'price-desc') {
        orderBy = { price: 'desc' }
    } else if (sort === 'new') {
        orderBy = { createdAt: 'desc' }
    } else {
        // 'smart' or default
        orderBy = { rankingScore: 'desc' }
    }

    // Execute query
    // Execute query
    const [products, totalSteps, categories] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.product.count({ where }),
        getCategories(lang),
    ])

    const totalPages = Math.ceil(totalSteps / limit)

    // Create category map for localization (slug -> name)
    const categoryMap = new Map(categories.map(c => [c.slug, c.name]))

    const mappedProducts = products.map(p => {
        const mapped = mapProduct(p, lang)
        // Override category slug with localized name for display
        if (mapped.category && categoryMap.has(mapped.category)) {
            mapped.category = categoryMap.get(mapped.category)!
        } else if (mapped.category === 'digital') {
            // Fallback if sync hasn't run or category missing
            mapped.category = 'Цифровые товары'
        }
        return mapped
    })

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">{dict.categories.title}</h1>
                    <p className="mt-2 text-slate-400">
                        {totalSteps} {dict.common.all.toLowerCase()}
                    </p>
                </div>
                {/* Language Switcher could go here */}
            </div>

            {/* Filters */}
            <div className="mb-8">
                <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                    <ProductFilters categories={categories} dict={dict} />
                </Suspense>
            </div>

            {/* Products Grid */}
            <ProductGrid products={mappedProducts} dict={dict} />

            {/* Pagination placeholder */}
            {mappedProducts.length > 0 && (
                <div className="mt-12 flex justify-center">
                    <p className="text-sm text-slate-500">
                        {/* Simple pagination info */}
                        Displaying {mappedProducts.length} items
                    </p>
                </div>
            )}
        </div>
    )
}
