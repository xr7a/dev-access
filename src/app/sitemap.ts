import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devaccess.ru'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/affiliate`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/refund`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ]

    // Try to get dynamic pages from DB (may fail at build time)
    let productPages: MetadataRoute.Sitemap = []
    let categoryPages: MetadataRoute.Sitemap = []

    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            select: {
                id: true,
                updatedAt: true,
            },
        })

        productPages = products.map((product) => ({
            url: `${baseUrl}/products/${product.id}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        const categories = await prisma.category.findMany({
            select: {
                slug: true,
            },
        })

        categoryPages = categories.map((category) => ({
            url: `${baseUrl}/products?category=${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }))
    } catch {
        // DB not available at build time - return only static pages
        console.log('Sitemap: DB not available, returning static pages only')
    }

    return [...staticPages, ...productPages, ...categoryPages]
}

