'use client'

import Link from 'next/link'
import { ShoppingCart, Bot, Flame, Star } from 'lucide-react'
import { Card, CardContent, Badge, Button } from '@/components/ui'
// import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
    product: Product
    dict: any
}

export function ProductCard({ product, dict }: ProductCardProps) {
    // Cart store removed for direct checkout

    const currentPrice = product.discountPrice ?? product.price
    const hasDiscount = product.discountPrice && product.discountPrice < product.price

    return (
        <Card className="group h-full overflow-hidden transition-transform hover:-translate-y-1 relative">
            {/* Image Area - Clickable */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">{product.title}</span>
                </Link>

                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Bot className="h-16 w-16 text-slate-700" />
                    </div>
                )}

                {hasDiscount && (
                    <Badge variant="destructive" className="absolute left-3 top-3 z-20">
                        -{Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100)}%
                    </Badge>
                )}

                {/* Rankings Badges */}
                <div className="absolute right-3 top-3 flex flex-col gap-1 items-end z-20">
                    {(product.rankingScore && product.rankingScore > 80) && (
                        <Badge className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1">
                            <Flame className="h-3 w-3 fill-white" /> {dict.common.hot}
                        </Badge>
                    )}
                    {(product.promotionLevel && product.promotionLevel > 0) && (
                        <Badge className="bg-amber-400 text-black hover:bg-amber-500 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-black" /> {dict.common.promo}
                        </Badge>
                    )}
                </div>
            </div>

            <CardContent className="p-4 relative">
                {/* Category */}
                <Badge variant="secondary" className="mb-2">
                    {product.category}
                </Badge>

                {/* Title - Clickable */}
                <Link href={`/products/${product.id}`} className="block min-h-[3rem]">
                    <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-3 leading-snug">
                        {product.title}
                    </h3>
                </Link>

                {/* Price & Actions */}
                <div className="mt-4 flex items-center justify-between gap-2">
                    <div>
                        {hasDiscount ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-white">
                                    {formatPrice(currentPrice)}
                                </span>
                                <span className="text-sm text-slate-500 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-white">
                                {formatPrice(currentPrice)}
                            </span>
                        )}
                    </div>

                    {/* Direct Buy Button (Independent Link) */}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 shrink-0 z-20 relative"
                        asChild
                    >
                        <a
                            href={`https://oplata.info/asp2/pay.asp?id_d=${product.digisellerProductId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </a>
                    </Button>
                </div>

                {/* Sales count */}
                {product.salesCount > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                        {dict.common.buy_count.replace('{count}', product.salesCount.toString())}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
