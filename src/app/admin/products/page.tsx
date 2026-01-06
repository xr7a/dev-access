import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ProductActions } from '@/components/admin/ProductActions'
import { SyncButton } from '@/components/admin/SyncButton'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Товары</h1>
                <div className="flex gap-4">
                    <SyncButton />
                    <Link href="/admin/products/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Добавить товар
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                            <th className="p-4 font-medium">Товар</th>
                            <th className="p-4 font-medium">Категория</th>
                            <th className="p-4 font-medium">Цена</th>
                            <th className="p-4 font-medium">Статус</th>
                            <th className="p-4 font-medium text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-800/50">
                                <td className="p-4">
                                    <div className="font-medium text-white">{product.title}</div>
                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                        id: {product.id}
                                    </div>
                                </td>
                                <td className="p-4 text-slate-300">{product.category}</td>
                                <td className="p-4 text-slate-300">
                                    {formatPrice(Number(product.price))}
                                    {product.discountPrice && (
                                        <span className="ml-2 text-xs text-red-400 line-through">
                                            {formatPrice(Number(product.discountPrice))}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${product.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {product.isActive ? 'Активен' : 'Черновик'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <ProductActions productId={product.id} digisellerId={product.digisellerProductId} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
