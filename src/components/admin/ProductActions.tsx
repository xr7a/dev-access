'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pencil, Trash, Copy, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductActionsProps {
    productId: string
    digisellerId?: string | null
}

export function ProductActions({ productId, digisellerId }: ProductActionsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleClone() {
        if (!digisellerId) {
            alert('Cannot clone: No Digiseller ID')
            return
        }
        if (!confirm('Are you sure you want to clone this product on Digiseller?')) return

        setLoading(true)
        try {
            const res = await fetch('/api/admin/products/clone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ digisellerId }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Clone failed')
            }

            alert(`Product cloned successfully! New ID: ${data.id_goods}`)
            router.refresh()
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Clone failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-end gap-2">
            {digisellerId && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-blue-400"
                    onClick={handleClone}
                    disabled={loading}
                    title="Clone on Digiseller"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                </Button>
            )}

            <Link href={`/admin/products/${productId}`}>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                </Button>
            </Link>

            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 opacity-50 cursor-not-allowed">
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    )
}
