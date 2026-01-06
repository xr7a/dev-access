'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui'
import { ShoppingCart, Loader2, ExternalLink } from 'lucide-react'

interface Props {
    productId: string
    initialPrice: number
    digisellerId: string
    className?: string
}

export function BuyNowButton({ productId, initialPrice, digisellerId, className }: Props) {
    const [price, setPrice] = useState<number>(initialPrice)
    const [loading, setLoading] = useState(false) // Initial is valid, background check
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // Background check for live price
        setChecking(true)
        fetch(`/api/products/${productId}/live-price`)
            .then(r => r.json())
            .then(data => {
                if (data && typeof data.price === 'number') {
                    setPrice(data.price)
                }
            })
            .catch(err => console.error(err))
            .finally(() => setChecking(false))
    }, [productId])

    const directUrl = `https://oplata.info/asp2/pay.asp?id_d=${digisellerId}`

    return (
        <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
        >
            <Button size="lg" className="w-full gap-2 font-bold relative group bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                <ShoppingCart className="h-5 w-5" />
                <span>Купить за {price.toLocaleString('ru-RU')} ₽</span>

                {checking && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-3 w-3 animate-spin opacity-70" />
                    </div>
                )}

                <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity ml-1" />
            </Button>
            {checking && (
                <p className="text-[10px] text-center text-slate-500 mt-1">Проверка цены...</p>
            )}
            {!checking && price !== initialPrice && (
                <p className="text-[10px] text-center text-amber-500 mt-1">Цена обновлена</p>
            )}
        </a>
    )
}
