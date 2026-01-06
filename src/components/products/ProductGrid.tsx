'use client'

import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui'
import type { Product } from '@/types'

interface ProductGridProps {
    products: Product[]
    isLoading?: boolean
    dict: any
}

export function ProductGrid({ products, isLoading, dict }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-[4/3] rounded-2xl" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-9 w-9 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="text-center">
                    <p className="text-lg font-medium text-white">Товары не найдены</p>
                    <p className="mt-1 text-sm text-slate-400">
                        Попробуйте изменить параметры поиска
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} dict={dict} />
            ))}
        </div>
    )
}
