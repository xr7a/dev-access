import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, ShoppingCart, Package, Users, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
    const [
        productsCount,
        ordersCount,
        usersCount,
        paidOrdersRevenue,
        topProducts
    ] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.aggregate({
            where: { status: 'PAID' },
            _sum: { totalAmount: true },
            _count: true
        }),
        prisma.product.findMany({
            orderBy: { salesCount: 'desc' },
            take: 5,
            select: { id: true, title: true, salesCount: true, price: true }
        })
    ])

    const stats = [
        {
            title: 'Общая выручка',
            value: formatPrice(Number(paidOrdersRevenue._sum.totalAmount || 0)),
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        {
            title: 'Оплаченных заказов',
            value: paidOrdersRevenue._count,
            icon: ShoppingCart,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Товаров в каталоге',
            value: productsCount,
            icon: Package,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10'
        },
        {
            title: 'Пользователей',
            value: usersCount,
            icon: Users,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Аналитика</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">{stat.title}</p>
                                    <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div className={`rounded-xl ${stat.bg} p-3 ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Top Products */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold text-white">Топ товаров по продажам</h2>
                    {topProducts.length > 0 ? (
                        <div className="space-y-3">
                            {topProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between rounded-lg border border-slate-800 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-400">
                                            {index + 1}
                                        </span>
                                        <span className="text-white">{product.title}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">
                                            {formatPrice(Number(product.price))}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {product.salesCount} продаж
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400">Нет данных о продажах</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
