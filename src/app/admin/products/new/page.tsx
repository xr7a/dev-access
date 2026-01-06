import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Create New Product</h1>
            <ProductForm />
        </div>
    )
}
