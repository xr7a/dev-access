'use client'

import { useState } from 'react'
import { RefreshCw, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { useRouter } from 'next/navigation'

export function AdminSyncButton() {
    const router = useRouter()
    const [isSyncing, setIsSyncing] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSync = async () => {
        setIsSyncing(true)
        setStatus('idle')
        setMessage('')

        try {
            const res = await fetch('/api/admin/sync', {
                method: 'POST',
            })
            const data = await res.json()

            if (data.success) {
                setStatus('success')
                setMessage(`Синхронизировано: ${data.data.synced}, Создано: ${data.data.created}`)
                router.refresh()
                setTimeout(() => setStatus('idle'), 5000)
            } else {
                setStatus('error')
                setMessage(data.error || 'Ошибка синхронизации')
            }
        } catch {
            setStatus('error')
            setMessage('Ошибка соединения')
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="flex items-center gap-3">
            {status === 'success' && (
                <span className="text-sm text-emerald-400 flex items-center">
                    <Check className="mr-1 h-3 w-3" />
                    {message}
                </span>
            )}
            {status === 'error' && (
                <span className="text-sm text-red-400 flex items-center">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {message}
                </span>
            )}

            <Button
                onClick={handleSync}
                disabled={isSyncing}
                variant="outline"
                className="border-violet-500/50 hover:bg-violet-500/10 text-violet-300"
            >
                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Синхронизация...' : 'Синхронизировать с Digiseller'}
            </Button>
        </div>
    )
}
