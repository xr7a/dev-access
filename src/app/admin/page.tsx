import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingCart, Users, BarChart3, Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { AdminSyncButton } from '@/components/admin/sync-button'

async function getAdminStats() {
    const [productsCount, ordersCount, usersCount, recentOrders] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { items: true },
        }),
    ])

    const revenue = await prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { totalAmount: true },
    })

    return {
        productsCount,
        ordersCount,
        usersCount,
        revenue: Number(revenue._sum.totalAmount || 0),
        recentOrders,
    }
}

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/dashboard')
    }

    const stats = await getAdminStats()

    const statCards = [
        { title: 'Товаров', value: stats.productsCount, icon: Package, href: '/admin/products' },
        { title: 'Заказов', value: stats.ordersCount, icon: ShoppingCart, href: '/admin/orders' },
        { title: 'Пользователей', value: stats.usersCount, icon: Users, href: '/admin/users' },
        { title: 'Выручка', value: formatPrice(stats.revenue), icon: BarChart3, href: '/admin/analytics' },
    ]

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Админ-панель</h1>
                    <p className="mt-2 text-slate-400">Управление магазином</p>
                </div>
                <AdminSyncButton />
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card className="cursor-pointer transition-colors hover:border-violet-500/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-400">{stat.title}</p>
                                        <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-800 p-3 text-violet-400">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">Быстрые действия</h2>
                        <div className="space-y-2">
                            <Link href="/admin/products/new">
                                <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-800">
                                    <Package className="h-5 w-5 text-emerald-400" />
                                    <span className="text-slate-300">Добавить товар</span>
                                </div>
                            </Link>
                            <Link href="/admin/orders?status=PENDING">
                                <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-800">
                                    <ShoppingCart className="h-5 w-5 text-amber-400" />
                                    <span className="text-slate-300">Ожидающие заказы</span>
                                </div>
                            </Link>
                            <Link href="/admin/settings">
                                <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-800">
                                    <Settings className="h-5 w-5 text-slate-400" />
                                    <span className="text-slate-300">Настройки</span>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">Последние заказы</h2>
                        {stats.recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-lg border border-slate-800 p-3"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-white">{order.email}</p>
                                            <p className="text-xs text-slate-500">
                                                {order.items.length} товаров
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-white">
                                                {formatPrice(Number(order.totalAmount))}
                                            </p>
                                            <p className={`text-xs ${order.status === 'PAID' ? 'text-emerald-400' :
                                                order.status === 'PENDING' ? 'text-amber-400' : 'text-slate-500'
                                                }`}>
                                                {order.status === 'PAID' ? 'Оплачен' :
                                                    order.status === 'PENDING' ? 'Ожидает' : order.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">Заказов пока нет</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
