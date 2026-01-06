// Product types
export interface Product {
    id: string
    title: string
    description: string
    shortDesc?: string
    price: number
    discountPrice?: number
    category: string
    tags: string[]
    imageUrl?: string
    images?: string[]
    digisellerProductId: string
    isActive: boolean
    salesCount: number
    rankingScore?: number
    promotionLevel?: number
    createdAt: Date
    updatedAt: Date
}

// Cart types
export interface CartItem {
    product: Product
    quantity: number
}

export interface Cart {
    items: CartItem[]
    total: number
}

// Order types
export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

export interface Order {
    id: string
    email: string
    userId?: string
    totalAmount: number
    status: OrderStatus
    paymentMethod?: string
    digisellerInvoiceId?: string
    referralCode?: string
    createdAt: Date
    updatedAt: Date
    items: OrderItem[]
}

export interface OrderItem {
    id: string
    orderId: string
    productId: string
    quantity: number
    price: number
    product?: Product
}

// User types
export type UserRole = 'PARTNER' | 'ADMIN'

export interface User {
    id: string
    email: string
    name?: string
    role: UserRole
    referralCode: string
    balance: number
    createdAt: Date
}

// Referral types
export interface ReferralStat {
    id: string
    userId: string
    clicks: number
    conversions: number
    earned: number
    date: Date
}

// Category types
export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    imageUrl?: string
    sortOrder: number
}

// API Response types
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// Digiseller types
export interface DigisellerInvoice {
    invoiceId: string
    invoiceUrl: string
}

export interface DigisellerProduct {
    id: number
    name: string
    price: number
    currency: string
}

export interface DigisellerWebhookPayload {
    invoice_id: string
    id_goods: number
    amount: number
    type_curr: string
    profit: number
    email: string
    date_pay: string
    sign: string
}
