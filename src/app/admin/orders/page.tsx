import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Ожидает', color: 'text-amber-400' },
    PAID: { label: 'Оплачен', color: 'text-emerald-400' },
    CANCELLED: { label: 'Отменён', color: 'text-red-400' },
    COMPLETED: { label: 'Завершён', color: 'text-blue-400' },
}

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: { product: true }
            }
        },
        take: 50
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Заказы</h1>
            </div>

            {orders.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-slate-400">
                        Заказов пока нет
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm text-slate-500">
                                                #{order.id.slice(0, 8)}
                                            </span>
                                            <span className={`text-sm font-medium ${statusLabels[order.status]?.color || 'text-slate-400'}`}>
                                                {statusLabels[order.status]?.label || order.status}
                                            </span>
                                        </div>
                                        <p className="text-white font-medium">{order.email}</p>
                                        <p className="text-sm text-slate-400">
                                            {order.items.length} товаров
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xl font-bold text-white">
                                            {formatPrice(Number(order.totalAmount))}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {order.items.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-800">
                                        <div className="space-y-2">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span className="text-slate-300">
                                                        {item.product?.title || 'Товар удалён'} × {item.quantity}
                                                    </span>
                                                    <span className="text-slate-400">
                                                        {formatPrice(Number(item.price))}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
