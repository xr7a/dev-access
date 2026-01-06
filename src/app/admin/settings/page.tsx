import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui'
import { Settings, RefreshCw, Globe, Database, Clock } from 'lucide-react'
import { AdminSyncButton } from '@/components/admin/sync-button'

export const dynamic = 'force-dynamic'

async function getSystemStats() {
    const [productsCount, categoriesCount, lastSyncedProduct] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.product.findFirst({
            where: { digisellerSyncedAt: { not: null } },
            orderBy: { digisellerSyncedAt: 'desc' },
            select: { digisellerSyncedAt: true }
        })
    ])

    return {
        productsCount,
        categoriesCount,
        lastSync: lastSyncedProduct?.digisellerSyncedAt
    }
}

export default async function AdminSettingsPage() {
    const stats = await getSystemStats()

    const hasDigisellerApi = !!(process.env.DIGISELLER_API_KEY && process.env.DIGISELLER_SELLER_ID)
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const sellerId = process.env.DIGISELLER_SELLER_ID || 'Не указан'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Настройки</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Sync Settings */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-violet-500/10 rounded-lg">
                                <RefreshCw className="h-5 w-5 text-violet-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Синхронизация</h2>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">
                            Товары синхронизируются с Digiseller при запуске и по запросу.
                        </p>
                        <div className="space-y-3 text-sm mb-4">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Синхронизировано товаров</span>
                                <span className="text-slate-300">{stats.productsCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Категорий</span>
                                <span className="text-slate-300">{stats.categoriesCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Последняя синхронизация</span>
                                <span className="text-slate-300">
                                    {stats.lastSync
                                        ? new Date(stats.lastSync).toLocaleString('ru-RU', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : 'Никогда'
                                    }
                                </span>
                            </div>
                        </div>
                        <AdminSyncButton />
                    </CardContent>
                </Card>

                {/* Integrations */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Globe className="h-5 w-5 text-blue-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Интеграции</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${hasDigisellerApi ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                    <span className="text-slate-300">Digiseller API</span>
                                </div>
                                <span className={`text-xs ${hasDigisellerApi ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {hasDigisellerApi ? 'Подключено' : 'Не настроено'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${hasDatabaseUrl ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                    <span className="text-slate-300">База данных</span>
                                </div>
                                <span className={`text-xs ${hasDatabaseUrl ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {hasDatabaseUrl ? 'Подключено' : 'Не настроено'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Store Info */}
                <Card className="md:col-span-2">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Settings className="h-5 w-5 text-amber-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Информация о магазине</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Seller ID</p>
                                <p className="text-slate-300 font-mono text-sm">{sellerId}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Валюта</p>
                                <p className="text-slate-300">RUB (₽)</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Язык</p>
                                <p className="text-slate-300">Русский / English</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Часовой пояс</p>
                                <p className="text-slate-300">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Environment Info */}
                <Card className="md:col-span-2">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-500/10 rounded-lg">
                                <Database className="h-5 w-5 text-slate-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Окружение</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Node.js</p>
                                <p className="text-slate-300 font-mono text-sm">{process.version}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Режим</p>
                                <p className="text-slate-300">{process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500">Платформа</p>
                                <p className="text-slate-300">{process.platform}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
