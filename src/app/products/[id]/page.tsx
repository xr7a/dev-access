import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Clock, Zap, Star, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui'
import prisma from '@/lib/prisma'
import { ProductCheckoutForm } from '@/components/products/ProductCheckoutForm'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { ProductContent } from '@/components/products/ProductContent'
import { ProductContentSkeleton } from '@/components/products/ProductContentSkeleton'
import { ProductJsonLd } from '@/components/seo/ProductJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
    params: Promise<{ id: string }>
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { id } = await params
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            title: true,
            shortDesc: true,
            description: true,
            category: true,
            tags: true,
            imageUrl: true,
            price: true,
            discountPrice: true,
        }
    })

    if (!product) {
        return {
            title: 'Товар не найден',
        }
    }

    const currentPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price)
    const description = product.shortDesc || product.description?.slice(0, 160) || `Купить ${product.title} в DevAccess`

    return {
        title: product.title,
        description: description,
        keywords: [product.category, ...product.tags, 'купить', 'скачать', 'цифровой товар'],
        openGraph: {
            title: `${product.title} | Купить в DevAccess`,
            description: description,
            type: 'website',
            images: product.imageUrl ? [
                {
                    url: product.imageUrl,
                    width: 800,
                    height: 600,
                    alt: product.title,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: description,
            images: product.imageUrl ? [product.imageUrl] : undefined,
        },
        alternates: {
            canonical: `/products/${id}`,
        },
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params

    const product = await prisma.product.findUnique({
        where: { id },
    })

    if (!product) {
        notFound()
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devaccess.ru'
    const currentPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price)
    const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price)
    const totalSales = product.salesCount + product.digisellerSalesCount
    const totalReviews = product.positiveReviews + product.negativeReviews
    const rating = totalReviews > 0
        ? (product.positiveReviews / totalReviews) * 5
        : undefined

    return (
        <>
            {/* Structured Data */}
            <ProductJsonLd
                name={product.title}
                description={product.shortDesc || product.description || ''}
                image={product.imageUrl || `${baseUrl}/images/placeholder.png`}
                price={currentPrice}
                originalPrice={hasDiscount ? Number(product.price) : undefined}
                currency="RUB"
                url={`${baseUrl}/products/${product.id}`}
                category={product.category}
                rating={rating}
                reviewCount={totalReviews > 0 ? totalReviews : undefined}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: 'Главная', url: baseUrl },
                    { name: 'Каталог', url: `${baseUrl}/products` },
                    { name: product.title, url: `${baseUrl}/products/${product.id}` },
                ]}
            />

            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="mb-4">
                    <ol className="flex items-center text-sm text-slate-400">
                        <li>
                            <Link href="/" className="hover:text-white transition-colors">
                                Главная
                            </Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li>
                            <Link href="/products" className="hover:text-white transition-colors">
                                Каталог
                            </Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li className="text-white truncate max-w-[200px]" aria-current="page">
                            {product.title}
                        </li>
                    </ol>
                </nav>

                {/* ============ TOP SECTION: Image Gallery + Form ============ */}
                <article itemScope itemType="https://schema.org/Product">
                    <meta itemProp="name" content={product.title} />
                    <meta itemProp="description" content={product.shortDesc || product.description || ''} />

                    <div className="grid gap-6 lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr]">
                        {/* Left: Product Image Gallery */}
                        <div className="relative">
                            <div className="sticky top-24 space-y-4">
                                {/* Image Gallery with thumbnails */}
                                <ProductImageGallery
                                    productId={product.id}
                                    mainImage={product.imageUrl || undefined}
                                    productTitle={product.title}
                                />

                                {hasDiscount && (
                                    <Badge variant="destructive" className="absolute left-3 top-3 z-10 text-sm px-2 py-0.5">
                                        -{Math.round((1 - currentPrice / Number(product.price)) * 100)}%
                                    </Badge>
                                )}

                                {/* Stats under gallery */}
                                <div className="flex justify-center gap-6 text-sm text-slate-500">
                                    {totalSales > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <ShoppingBag className="h-4 w-4" />
                                            <span>Продаж: <span className="text-white font-medium">{totalSales}</span></span>
                                        </div>
                                    )}
                                    {totalReviews > 0 && (
                                        <div className="flex items-center gap-1.5" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                                            <Star className="h-4 w-4 text-amber-400" />
                                            <span>Отзывов: <span className="text-white font-medium" itemProp="reviewCount">{totalReviews}</span></span>
                                            <meta itemProp="ratingValue" content={rating?.toFixed(1) || '5'} />
                                            <meta itemProp="bestRating" content="5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Product Info + Form */}
                        <div className="space-y-4">
                            {/* Category & Tags */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge>{product.category}</Badge>
                                {product.tags.slice(0, 3).map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-white lg:text-3xl leading-tight" itemProp="name">
                                {product.title}
                            </h1>

                            {/* Price with Schema.org markup */}
                            <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
                                <meta itemProp="price" content={currentPrice.toString()} />
                                <meta itemProp="priceCurrency" content="RUB" />
                                <meta itemProp="availability" content="https://schema.org/InStock" />
                                <meta itemProp="url" content={`${baseUrl}/products/${product.id}`} />
                            </div>

                            {/* Checkout Form */}
                            <ProductCheckoutForm
                                productId={product.id}
                                digisellerProductId={product.digisellerProductId}
                                initialPrice={currentPrice}
                                productTitle={product.title}
                            />

                            {/* Features row */}
                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Clock className="h-4 w-4 text-violet-400" />
                                    <span>Мгновенная доставка</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Shield className="h-4 w-4 text-green-400" />
                                    <span>Гарантия возврата</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Zap className="h-4 w-4 text-amber-400" />
                                    <span>Поддержка 24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* ============ BOTTOM SECTION: Content Tabs ============ */}
                <div className="mt-8">
                    <Suspense fallback={<ProductContentSkeleton />}>
                        <ProductContent
                            digisellerProductId={product.digisellerProductId}
                            fallbackDescription={product.description}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    )
}
