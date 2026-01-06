'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { Product } from '@/types'
import { useRouter } from 'next/navigation'

const productSchema = z.object({
    title: z.string().min(3, 'Название обязательно'),
    description: z.string().min(10, 'Описание обязательно'),
    shortDesc: z.string().optional(),
    price: z.coerce.number().min(0),
    discountPrice: z.coerce.number().optional(),
    category: z.string().min(1, 'Категория обязательна'),
    tags: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    digisellerProductId: z.string().optional(),
    isActive: z.boolean().default(true),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
    initialData?: Product
    isEdit?: boolean
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const form = useForm<ProductFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            shortDesc: initialData?.shortDesc || '',
            price: initialData?.price || 0,
            discountPrice: initialData?.discountPrice || undefined,
            category: initialData?.category || '',
            tags: initialData?.tags?.join(', ') || '',
            imageUrl: initialData?.imageUrl || '',
            digisellerProductId: initialData?.digisellerProductId || '',
            isActive: initialData?.isActive ?? true,
        },
    })

    async function onSubmit(values: ProductFormValues) {
        setLoading(true)
        setError('')

        try {
            // Parse tags
            const tagsArray = values.tags
                ? values.tags.split(',').map(t => t.trim()).filter(Boolean)
                : []

            const payload = {
                ...values,
                tags: tagsArray,
            }

            const url = isEdit ? `/api/products/${initialData?.id}` : '/api/products'
            const method = isEdit ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to save product')
            }

            router.push('/admin/products')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-card p-6 rounded-lg border">
            {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Название</Label>
                    <Input id="title" {...form.register('title')} />
                    {form.formState.errors.title && (
                        <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Input id="category" {...form.register('category')} />
                    {form.formState.errors.category && (
                        <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Цена (₽)</Label>
                        <Input id="price" type="number" {...form.register('price')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discountPrice">Цена со скидкой</Label>
                        <Input id="discountPrice" type="number" {...form.register('discountPrice')} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shortDesc">Краткое описание</Label>
                    <Input id="shortDesc" {...form.register('shortDesc')} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Полное описание</Label>
                    <Textarea id="description" rows={8} {...form.register('description')} />
                    {form.formState.errors.description && (
                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL изображения</Label>
                    <Input id="imageUrl" {...form.register('imageUrl')} />
                    {form.formState.errors.imageUrl && (
                        <p className="text-sm text-destructive">{form.formState.errors.imageUrl.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Теги (через запятую)</Label>
                    <Input id="tags" {...form.register('tags')} placeholder="ai, gpt, premium" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="digisellerId">ID товара в Digiseller</Label>
                    <Input id="digisellerId" {...form.register('digisellerProductId')} />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="isActive"
                        checked={form.watch('isActive')}
                        onCheckedChange={(c) => form.setValue('isActive', c as boolean)}
                    />
                    <Label htmlFor="isActive">Активен (виден в каталоге)</Label>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Сохранить' : 'Создать'}
                </Button>
            </div>
        </form>
    )
}
