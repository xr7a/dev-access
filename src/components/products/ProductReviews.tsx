'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, ThumbsDown, MessageSquare, Loader2, ChevronDown } from 'lucide-react'

interface Review {
    id_review: number
    date: string
    info: string
    type: 'good' | 'bad'
    answer?: string
}

interface ProductReviewsProps {
    digisellerId: number
    initialReviews?: Review[]
    initialTotal?: number
    initialPages?: number
}

export function ProductReviews({ digisellerId, initialReviews = [], initialTotal = 0, initialPages = 1 }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews)
    const [loading, setLoading] = useState(initialReviews.length === 0)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [totalReviews, setTotalReviews] = useState(initialTotal)
    const [totalPages, setTotalPages] = useState(initialPages)

    // Load initial reviews if not provided
    useEffect(() => {
        if (initialReviews.length === 0 && digisellerId) {
            fetchReviews(1, true)
        }
    }, [digisellerId])

    async function fetchReviews(pageNum: number, replace = false) {
        if (replace) {
            setLoading(true)
        } else {
            setLoadingMore(true)
        }

        try {
            const res = await fetch(`/api/products/${digisellerId}/reviews?page=${pageNum}&rows=10`)
            const data = await res.json()

            if (data.reviews) {
                if (replace) {
                    setReviews(data.reviews)
                } else {
                    setReviews(prev => [...prev, ...data.reviews])
                }
                setTotalPages(data.pages || 1)
                setTotalReviews(data.total || 0)
                setPage(pageNum)
            }
        } catch (error) {
            console.error('Failed to load reviews', error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const handleLoadMore = () => {
        if (page < totalPages) {
            fetchReviews(page + 1, false)
        }
    }

    const hasMore = page < totalPages

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6 lg:p-8">
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (reviews.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 lg:p-8">
                    <div className="text-center py-12 text-slate-500">
                        Отзывов пока нет
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-6 lg:p-8">
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id_review} className="border-b border-slate-800 pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {review.type === 'good' ? (
                                        <>
                                            <ThumbsUp className="h-4 w-4 text-green-500" />
                                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 py-0.5">
                                                Положительный
                                            </Badge>
                                        </>
                                    ) : (
                                        <>
                                            <ThumbsDown className="h-4 w-4 text-red-500" />
                                            <Badge variant="destructive" className="py-0.5">
                                                Отрицательный
                                            </Badge>
                                        </>
                                    )}
                                    <span className="text-xs text-slate-500">{review.date}</span>
                                </div>
                            </div>
                            <p className="text-slate-300 whitespace-pre-wrap">{review.info}</p>
                            {review.answer && (
                                <div className="mt-4 ml-4 border-l-2 border-violet-500/50 pl-4">
                                    <div className="flex items-center gap-1.5 text-violet-400 mb-1">
                                        <MessageSquare className="h-3 w-3" />
                                        <span className="text-xs font-medium">Ответ продавца:</span>
                                    </div>
                                    <p className="text-sm text-slate-400">{review.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="mt-6 text-center">
                        <Button
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="gap-2"
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Загрузка...
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-4 w-4" />
                                    Загрузить ещё
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Reviews Count */}
                <div className="mt-4 text-center text-xs text-slate-500">
                    Показано {reviews.length} из {totalReviews} отзывов
                </div>
            </CardContent>
        </Card>
    )
}
