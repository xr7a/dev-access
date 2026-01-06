'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SyncButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSync() {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/sync', {
                method: 'POST',
            })

            const data = await res.json()

            if (!res.ok) {
                // If 401, maybe just warn clearly
                if (res.status === 401) throw new Error('Unauthorized: You need Admin role')
                throw new Error(data.error || 'Sync failed')
            }

            // Success message
            alert(`Sync complete! Synced: ${data.data.synced}, Created: ${data.data.created}, Updated: ${data.data.updated}`)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Sync failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleSync}
            disabled={loading}
            className="gap-2"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <RefreshCw className="h-4 w-4" />
            )}
            Sync from Digiseller
        </Button>
    )
}
