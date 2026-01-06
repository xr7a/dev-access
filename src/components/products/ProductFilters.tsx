'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Button, Input, Badge } from '@/components/ui'

interface Category {
    id: string
    name: string
    slug: string
}

interface ProductFiltersProps {
    categories: Category[]
    dict: any // Type this properly if possible, but 'any' or 'Record<string, any>' is faster for now
}


export function ProductFilters({ categories, dict }: ProductFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [showFilters, setShowFilters] = useState(false)

    const currentCategory = searchParams.get('category')
    const currentSort = searchParams.get('sort') || 'smart'

    const sortOptions = [
        { value: 'smart', label: dict.sort.smart },
        { value: 'new', label: dict.sort.new },
        { value: 'popular', label: dict.sort.popular },
        { value: 'price-asc', label: dict.sort.price_asc },
        { value: 'price-desc', label: dict.sort.price_desc },
    ]

    const updateParams = useCallback(
        (key: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
            params.delete('page') // Reset page on filter change
            router.push(`/products?${params.toString()}`)
        },
        [router, searchParams]
    )

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        updateParams('search', search || null)
    }

    const clearFilters = () => {
        router.push('/products')
        setSearch('')
    }

    const hasActiveFilters = currentCategory || searchParams.get('search')

    return (
        <div className="space-y-4">
            {/* Search & Filter Toggle */}
            <div className="flex gap-3">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <Input
                            type="text"
                            placeholder={dict.common.search_placeholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </form>
                <Button
                    variant={showFilters ? 'default' : 'outline'}
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            </div>

            {/* Desktop Filters */}
            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                    <h3 className="mb-3 text-sm font-medium text-slate-300">{dict.categories.title}</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={!currentCategory ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateParams('category', null)}
                        >
                            {dict.common.all}
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={currentCategory === cat.slug ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateParams('category', cat.slug)}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Sort */}
                <div>
                    <h3 className="mb-3 text-sm font-medium text-slate-300">{dict.sort.title}</h3>
                    <div className="flex flex-wrap gap-2">
                        {sortOptions.map((option) => (
                            <Button
                                key={option.value}
                                variant={currentSort === option.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateParams('sort', option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-400 hover:text-red-300"
                    >
                        <X className="mr-1 h-4 w-4" />
                        {dict.common.clear_filters}
                    </Button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-400">{dict.common.active_filters}</span>
                    {currentCategory && (
                        <Badge variant="secondary">
                            {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                            <button
                                onClick={() => updateParams('category', null)}
                                className="ml-1 hover:text-white"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {searchParams.get('search') && (
                        <Badge variant="secondary">
                            &quot;{searchParams.get('search')}&quot;
                            <button
                                onClick={() => {
                                    setSearch('')
                                    updateParams('search', null)
                                }}
                                className="ml-1 hover:text-white"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )
}
