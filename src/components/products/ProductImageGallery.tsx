'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, Zap, ZoomIn } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductImage {
    id: number
    url: string
    width: number
    height: number
}

interface ProductImageGalleryProps {
    productId: string
    mainImage?: string
    productTitle: string
}

export function ProductImageGallery({ productId, mainImage, productTitle }: ProductImageGalleryProps) {
    const [images, setImages] = useState<ProductImage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(`/api/products/${productId}/options`)
                if (res.ok) {
                    const data = await res.json()
                    setImages(data.images || [])
                }
            } catch (e) {
                console.error('Failed to fetch images:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchImages()
    }, [productId])

    // Keyboard navigation for lightbox
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!lightboxOpen) return
        if (e.key === 'Escape') setLightboxOpen(false)
        if (e.key === 'ArrowLeft') setSelectedIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1))
        if (e.key === 'ArrowRight') setSelectedIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0))
    }, [lightboxOpen])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [lightboxOpen])

    // Use API images if available, otherwise fallback to mainImage from DB
    const allImages = images.length > 0
        ? images
        : (mainImage ? [{ id: 0, url: mainImage, width: 500, height: 500 }] : [])

    const selectedImage = allImages[selectedIndex] || (mainImage ? { id: 0, url: mainImage } : null)

    const goToPrev = () => {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1))
    }

    const goToNext = () => {
        setSelectedIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0))
    }

    const openLightbox = () => {
        setLightboxOpen(true)
    }

    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <div className="flex gap-2">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <Skeleton className="w-16 h-16 rounded-lg" />
                </div>
            </div>
        )
    }

    if (!selectedImage) {
        return (
            <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <Zap className="h-16 w-16 text-violet-500/50" />
            </div>
        )
    }

    return (
        <>
            <div className="space-y-3">
                {/* Main Image - clickable for lightbox */}
                <div
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 group cursor-zoom-in"
                    onClick={openLightbox}
                >
                    <img
                        src={selectedImage.url}
                        alt={`${productTitle} - изображение ${selectedIndex + 1}`}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Zoom hint */}
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-3 w-3" />
                        Увеличить
                    </div>

                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrev() }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext() }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            {selectedIndex + 1} / {allImages.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {allImages.map((img, index) => (
                            <button
                                key={img.id || index}
                                onClick={() => setSelectedIndex(index)}
                                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${index === selectedIndex
                                    ? 'border-violet-500 ring-2 ring-violet-500/30'
                                    : 'border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                <img
                                    src={img.url}
                                    alt={`Миниатюра ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal - rendered via Portal to escape stacking contexts */}
            {lightboxOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                        aria-label="Закрыть"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    {/* Full size image */}
                    <img
                        src={selectedImage.url}
                        alt={`${productTitle} - полный размер`}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Navigation in lightbox */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPrev() }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-10 w-10" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goToNext() }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-10 w-10" />
                            </button>
                        </>
                    )}

                    {/* Image counter in lightbox */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full">
                            {selectedIndex + 1} / {allImages.length}
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    )
}
