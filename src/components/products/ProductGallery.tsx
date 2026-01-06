'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Bot, ImageIcon } from 'lucide-react'

interface ProductGalleryProps {
    images: string[]
    title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    // Filter out empty or invalid images
    const validImages = images.filter(Boolean)
    const [selectedIndex, setSelectedIndex] = useState(0)

    if (validImages.length === 0) {
        return (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50 flex items-center justify-center">
                <Bot className="h-24 w-24 text-slate-700" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50">
                <img
                    src={validImages[selectedIndex]}
                    alt={title}
                    className="h-full w-full object-contain p-4 transition-all duration-300"
                />
            </div>

            {/* Thumbnails (only if more than 1) */}
            {validImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {validImages.map((image, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                                "relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border bg-slate-950",
                                selectedIndex === idx
                                    ? "border-violet-500 ring-2 ring-violet-500/20"
                                    : "border-slate-800 hover:border-slate-600"
                            )}
                        >
                            <img
                                src={image}
                                alt={`${title} ${idx + 1}`}
                                className="h-full w-full object-contain p-1"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
