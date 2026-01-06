'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingCart, Loader2, CheckCircle, Shield, Zap } from 'lucide-react'

interface ProductOption {
    id: number
    name: string
    type: 'text' | 'select' | 'radio'
    required: boolean
    comment?: string
    variants?: { id: number; name: string; rate?: number; modifyValue?: number }[]
}

interface ProductCheckoutFormProps {
    productId: string
    digisellerProductId: string
    initialPrice: number
    productTitle: string
}

interface ProductData {
    price: number
    currency: string
    options: ProductOption[]
}

/**
 * Custom Plati-style checkout form
 * Renders product options, email field, and handles checkout via our API
 */
export function ProductCheckoutForm({
    productId,
    digisellerProductId,
    initialPrice,
    productTitle
}: ProductCheckoutFormProps) {
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [productData, setProductData] = useState<ProductData | null>(null)
    const [email, setEmail] = useState('')
    const [optionValues, setOptionValues] = useState<Record<number, string>>({})
    const [error, setError] = useState<string | null>(null)

    // Fetch product details with options
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/products/${productId}/options`)
                if (res.ok) {
                    const data = await res.json()
                    setProductData(data)
                    // Initialize option values with null checks
                    const initialValues: Record<number, string> = {}
                    data.options?.forEach((opt: ProductOption) => {
                        if (opt.variants && opt.variants.length > 0 && opt.variants[0]?.id) {
                            initialValues[opt.id] = opt.variants[0].id.toString()
                        } else {
                            initialValues[opt.id] = ''
                        }
                    })
                    setOptionValues(initialValues)
                }
            } catch (e) {
                console.error('Failed to fetch product options:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [productId])

    const handleOptionChange = (optionId: number, value: string) => {
        setOptionValues(prev => ({ ...prev, [optionId]: value }))
    }

    const handleBuy = async () => {
        if (!email) {
            setError('Введите email для получения товара')
            return
        }

        setError(null)
        setSubmitting(true)

        try {
            // Create invoice via our API
            const res = await fetch('/api/checkout/create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    digisellerProductId,
                    email,
                    options: Object.entries(optionValues).map(([id, value]) => ({
                        id: Number(id),
                        value
                    }))
                })
            })

            if (res.ok) {
                const { paymentUrl } = await res.json()
                // Redirect to payment
                window.location.href = paymentUrl
            } else {
                const data = await res.json()
                setError(data.error || 'Ошибка при создании заказа')
            }
        } catch (e) {
            setError('Ошибка соединения. Попробуйте еще раз.')
        } finally {
            setSubmitting(false)
        }
    }

    // Calculate current price including variant modifiers
    const calculatedPrice = useMemo(() => {
        let price = productData?.price ?? initialPrice

        // Add modifier from selected variants
        productData?.options?.forEach(option => {
            const selectedValue = optionValues[option.id]
            if (selectedValue && option.variants) {
                const selectedVariant = option.variants.find(v => String(v.id) === selectedValue)
                if (selectedVariant?.modifyValue) {
                    price += selectedVariant.modifyValue
                }
            }
        })

        return price
    }, [productData, optionValues, initialPrice])

    if (loading) {
        return (
            <div className="space-y-3 p-4 rounded-xl border border-slate-700 bg-slate-900/50">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-4 p-4 rounded-xl border border-slate-700 bg-slate-900/50 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Price Display */}
            <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white">
                    {calculatedPrice.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
                </span>
                {calculatedPrice !== (productData?.price ?? initialPrice) && (
                    <span className="text-sm text-slate-500 line-through">
                        {(productData?.price ?? initialPrice).toLocaleString('ru-RU')} ₽
                    </span>
                )}
            </div>

            {/* Product Options */}
            {productData?.options && productData.options.length > 0 && (
                <div className="space-y-3">
                    {productData.options.map((option) => (
                        <div key={option.id} className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300">
                                {option.name}
                                {option.required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {option.type === 'select' || (option.variants && option.variants.length > 0) ? (
                                // Radio buttons for variants (like Plati)
                                <div className="flex flex-wrap gap-2">
                                    {option.variants?.filter(v => v && v.id != null).map((variant) => (
                                        <label
                                            key={variant.id}
                                            className={`
                                                px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm
                                                ${optionValues[option.id] === String(variant.id)
                                                    ? 'border-violet-500 bg-violet-500/20 text-white'
                                                    : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500'
                                                }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name={`option-${option.id}`}
                                                value={variant.id}
                                                checked={optionValues[option.id] === String(variant.id)}
                                                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                                className="sr-only"
                                            />
                                            {variant.name}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                // Text input
                                <input
                                    type="text"
                                    value={optionValues[option.id] || ''}
                                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                    placeholder={option.comment || `Введите ${option.name.toLowerCase()}`}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                                />
                            )}

                            {option.comment && option.type === 'text' && (
                                <p className="text-xs text-slate-500">{option.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">
                    Email для получения товара <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
                    {error}
                </div>
            )}

            {/* Buy Button */}
            <Button
                size="default"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 py-5"
                onClick={handleBuy}
                disabled={submitting}
            >
                {submitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Создаем заказ...
                    </>
                ) : (
                    <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Купить сейчас
                    </>
                )}
            </Button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                    <span>Безопасная сделка</span>
                </div>
                <div className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Мгновенная доставка</span>
                </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-500 text-center">
                Нажимая на кнопку, вы соглашаетесь с{' '}
                <a href="/terms" className="text-violet-400 hover:underline">правилами покупки</a>
            </p>
        </div>
    )
}
