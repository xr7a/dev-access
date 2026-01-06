import prisma from '@/lib/prisma'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params

    const product = await prisma.product.findUnique({
        where: { id },
    })

    if (!product) {
        notFound()
    }

    // Convert Decimal and null values to plain JS types for client component
    const serializedProduct = {
        ...product,
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : undefined,
        shortDesc: product.shortDesc ?? undefined,
        imageUrl: product.imageUrl ?? undefined,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        digisellerSyncedAt: product.digisellerSyncedAt?.toISOString() ?? undefined,
        promotionExpiresAt: product.promotionExpiresAt?.toISOString() ?? undefined,
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Редактирование товара</h1>
            <ProductForm initialData={serializedProduct as any} isEdit />
        </div>
    )
}
