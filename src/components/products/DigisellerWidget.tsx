'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui'

interface DigisellerWidgetProps {
    digisellerProductId: string
    lang?: 'ru' | 'en'
}

/**
 * Digiseller Payment Widget
 * Embeds the official Digiseller widget that allows users to:
 * - See the current price
 * - Select product options (if available)
 * - Enter email
 * - Proceed to payment
 * 
 * This is similar to what Plati.Market uses.
 */
export function DigisellerWidget({ digisellerProductId, lang = 'ru' }: DigisellerWidgetProps) {
    const [isLoading, setIsLoading] = useState(true)

    // Widget URL - Digiseller's official embedded payment form
    // This includes product options, price, email field, and buy button
    const widgetUrl = `https://oplata.info/asp2/pay_wm.asp?id_d=${digisellerProductId}&lang=${lang === 'ru' ? 'ru-RU' : 'en-US'}&skin=green`

    useEffect(() => {
        // Set loading to false after iframe loads
        const timer = setTimeout(() => setIsLoading(false), 2000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="digiseller-widget relative">
            {isLoading && (
                <div className="absolute inset-0 z-10">
                    <Skeleton className="w-full h-full min-h-[300px]" />
                </div>
            )}
            <iframe
                src={widgetUrl}
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="no"
                className="rounded-xl border border-slate-700 bg-slate-900"
                onLoad={() => setIsLoading(false)}
                title="Digiseller Payment Widget"
                allow="payment"
            />
        </div>
    )
}
