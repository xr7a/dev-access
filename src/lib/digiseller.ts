import crypto from 'crypto'
import type { DigisellerInvoice, DigisellerProduct, DigisellerWebhookPayload } from '@/types'

const DIGISELLER_API_URL = 'https://api.digiseller.com/api'
const SELLER_ID = process.env.DIGISELLER_SELLER_ID!
const API_KEY = process.env.DIGISELLER_API_KEY!

interface CreateInvoiceParams {
    productId: string
    email: string
    amount: number
    returnUrl?: string
    failUrl?: string
    promocode?: string
    partnerUid?: string
}

export interface DigisellerCategory {
    id: number
    name: string
    cnt: number
}

export interface DigisellerProductListItem {
    id: number
    name: string
    price: number
    currency: string
    cnt_sell: number
    cnt_return: number
    cnt_good_responses: number
    cnt_bad_responses: number
    info?: string
    preview_img?: string
}

export interface DigisellerProductDetails {
    id: number
    name: string
    info: string
    add_info?: string
    price: number
    currency: string
    cnt_sell: number
    cnt_return: number
    cnt_good_responses: number
    cnt_bad_responses: number
    preview_imgs?: { url: string }[]
}

/**
 * Digiseller API Client
 * Documentation: https://my.digiseller.com/inside/api.asp
 */
export class DigisellerClient {
    private tokenCache: { token: string; expiresAt: number } | null = null

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${DIGISELLER_API_URL}${endpoint}`

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options?.headers,
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Digiseller API error: ${response.status} - ${errorText}`)
        }

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            // Check if it looks like maintenance html
            const text = await response.text()
            if (text.includes('Digiseller is experiencing an unscheduled maintenance work') || text.includes('регламентные работы')) {
                throw new Error(`Digiseller API Maintenance: Service is temporarily unavailable.`)
            }
            // Try to parse anyway, sometimes content-type is wrong, or throw error with preview
            try {
                return JSON.parse(text)
            } catch (e) {
                throw new Error(`Digiseller API Error: Invalid JSON response. Response preview: ${text.substring(0, 100)}...`)
            }
        }

        return response.json()
    }

    /**
     * Get seller token for authenticated requests (with caching)
     */
    async getToken(): Promise<string> {
        // Return cached token if still valid
        if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) {
            return this.tokenCache.token
        }

        const timestamp = Math.floor(Date.now() / 1000)
        const sign = crypto
            .createHash('sha256')
            .update(`${API_KEY}${timestamp}`)
            .digest('hex')

        const response = await this.request<{ token: string; valid_thru: number }>('/apilogin', {
            method: 'POST',
            body: JSON.stringify({
                seller_id: SELLER_ID,
                timestamp,
                sign,
            }),
        })

        // Cache token (expires in ~1 hour, we refresh 5 min early)
        this.tokenCache = {
            token: response.token,
            expiresAt: Date.now() + (response.valid_thru - 300) * 1000,
        }

        return response.token
    }

    /**
     * Get all categories for this seller
     */
    async getCategories(): Promise<DigisellerCategory[]> {
        const response = await this.request<{ category: DigisellerCategory[] }>(
            `/categories?seller_id=${SELLER_ID}&format=json`
        )
        return response.category || []
    }

    /**
     * Get products list from seller
     * https://api.digiseller.com/api/shop/products
     */
    async getProducts(options: {
        categoryId?: number
        page?: number
        rows?: number
        order?: 'name' | 'price' | 'priceDESC' | 'cntsell'
    } = {}): Promise<{ products: DigisellerProductListItem[]; totalPages: number }> {
        const params = new URLSearchParams({
            seller_id: SELLER_ID,
            category_id: (options.categoryId ?? 0).toString(), // 0 = all
            page: (options.page ?? 1).toString(),
            rows: (options.rows ?? 500).toString(),
            order: options.order ?? 'cntsell',
            currency: 'RUR',
            lang: 'ru-RU',
            format: 'json',
        })

        const response = await this.request<{
            product?: DigisellerProductListItem[]
            pages: number
        }>(`/shop/products?${params}`)

        return {
            products: response.product || [],
            totalPages: response.pages || 1,
        }
    }

    /**
     * Get detailed product information
     */
    async getProductDetails(productId: number): Promise<DigisellerProductDetails | null> {
        try {
            const response = await this.request<{ product: DigisellerProductDetails }>(
                `/products/${productId}/data?seller_id=${SELLER_ID}&currency=RUB&format=json`
            )
            return response.product || null
        } catch {
            return null
        }
    }



    /**
     * Fetch ALL products from all pages
     */
    async getAllProducts(): Promise<DigisellerProductListItem[]> {
        const allProducts: DigisellerProductListItem[] = []
        let page = 1
        let totalPages = 1

        do {
            const result = await this.getProducts({ page, rows: 500 })
            allProducts.push(...result.products)
            totalPages = result.totalPages
            page++
        } while (page <= totalPages)

        return allProducts
    }

    /**
     * Initialize product parameters to get id_po for payment
     * https://my.digiseller.com/inside/api_general.asp#purchase_options
     * 
     * This is required to pass selected options to oplata.info
     */
    async initParameters(productId: number, options: { id: number; value: string }[]): Promise<string | null> {
        try {
            // Format options as required by Digiseller API
            const optionsPayload = options.map(opt => ({
                id: opt.id,
                value: opt.value
            }))

            const response = await this.request<{
                retval?: number
                id_po?: string
                content?: {
                    id_po?: string
                }
                error?: string
            }>('/purchases/options', {
                method: 'POST',
                body: JSON.stringify({
                    product_id: productId,
                    options: optionsPayload
                })
            })

            // Check for id_po in response (may be nested in content)
            const idPo = response.id_po || response.content?.id_po

            if (idPo) {
                return idPo
            }

            console.warn('[Digiseller] No id_po returned:', response)
            return null
        } catch (error) {
            console.error('[Digiseller] Error initializing parameters:', error)
            return null
        }
    }

    /**
     * Create payment invoice for an order
     */
    async createInvoice(params: CreateInvoiceParams): Promise<DigisellerInvoice> {
        const token = await this.getToken()

        const response = await this.request<{
            id: number
            url: string
        }>('/purchase/create', {
            method: 'POST',
            body: JSON.stringify({
                token,
                id_seller: SELLER_ID,
                id_goods: params.productId,
                email: params.email,
                amount: params.amount,
                currency: 'RUB',
                lang: 'ru-RU',
                urlSuccess: params.returnUrl,
                urlFail: params.failUrl,
                promocode: params.promocode,
                partner_uid: params.partnerUid,
            }),
        })

        return {
            invoiceId: response.id.toString(),
            invoiceUrl: response.url,
        }
    }

    /**
     * Get product information (Alias for getProductDetails)
     */
    async getProduct(productId: number | string): Promise<DigisellerProductDetails | null> {
        return this.getProductDetails(Number(productId))
    }

    /**
     * Verify webhook signature from Digiseller
     */
    verifyWebhookSignature(payload: DigisellerWebhookPayload): boolean {
        const expectedSign = crypto
            .createHash('sha256')
            .update(`${SELLER_ID}:${payload.amount}:${payload.invoice_id}:${API_KEY}`)
            .digest('hex')

        return payload.sign === expectedSign
    }

    /**
     * Generate affiliate link for a product
     */
    generateAffiliateLink(productId: string, referralCode: string): string {
        return `https://oplata.info/asp2/pay.asp?id_d=${productId}&ai=${referralCode}`
    }

    /**
     * ==========================================
     * GENERAL METHODS (Phase 1)
     * ==========================================
     */

    /**
     * Register a new partner
     * https://my.digiseller.com/inside/api_general.asp#partner
     */
    async registerPartner(email: string): Promise<{ id_partner: number; retval: number; desc: string }> {
        const token = await this.getToken()
        return this.request('/seller/partner/reg', {
            method: 'POST',
            body: JSON.stringify({
                token,
                email,
            }),
        })
    }

    /**
     * Search and verify payment by unique code
     * https://my.digiseller.com/inside/api_general.asp#searchuniquecode
     */
    async findPaymentByCode(code: string): Promise<{
        retval: number
        inv: number
        id_goods: number
        amount: number
        date_pay: string
        email: string
        options?: { id: number; name: string; value: string }[]
    }> {
        const token = await this.getToken()
        return this.request('/purchases/unique-code/find', {
            method: 'POST',
            body: JSON.stringify({
                token,
                unique_code: code,
                id_seller: SELLER_ID,
            }),
        })
    }

    /**
     * Get detailed purchase information
     * https://my.digiseller.com/inside/api_general.asp#purchase_info
     */
    async getPurchaseInfo(invoiceId: number): Promise<{
        retval: number
        inv: number
        id_goods: number
        amount: number
        date_pay: string
        email: string
        unique_code: string
        lang: string
        name_goods: string
        unit_goods: number
        cnt_goods: number
        type_curr: string
        options?: { id: number; name: string; value: string }[]
    }> {
        const token = await this.getToken()
        return this.request(`/purchase/info/${invoiceId}?token=${token}`, {
            method: 'GET',
        })
    }

    /**
     * ==========================================
     * PRODUCTS & CATEGORIES (Phase 2)
     * ==========================================
     */

    /**
     * Get product reviews
     * https://my.digiseller.com/inside/api_catgoods.asp#reviews
     */
    async getReviews(productId: number, type: 'all' | 'good' | 'bad' = 'all', page = 1, rows = 10): Promise<{
        total: number
        pages: number
        reviews: {
            id_review: number
            date: string
            info: string // Review text
            type: 'good' | 'bad'
            answer?: string // Seller answer
        }[]
    }> {
        // Correct endpoint: /reviews?product_id=...&seller_id=...
        // Docs: https://api.digiseller.com/api/reviews?product_id=1110845&seller_id=152200&rows=15&format=json
        const typeParam = type === 'all' ? '' : `&type=${type}`
        const response = await this.request<{
            retval?: number
            totalItems?: number  // Correct field name
            totalPages?: number  // Correct field name
            review?: any[]       // Note: 'review' not 'reviews'
        }>(`/reviews?product_id=${productId}&seller_id=${SELLER_ID}&page=${page}&rows=${rows}${typeParam}`)

        return {
            total: response.totalItems || 0,
            pages: response.totalPages || 0,
            reviews: (response.review || []).map(r => ({
                id_review: r.id,
                date: r.date,
                info: r.info,
                type: r.type === 'good' ? 'good' : 'bad',
                answer: r.answer
            }))
        }
    }

    /**
     * Clone a product
     * https://my.digiseller.com/inside/api_catgoods.asp#copyproduct
     */
    async cloneProduct(productId: number): Promise<{ retval: number; id_goods: number; desc: string }> {
        const token = await this.getToken()
        return this.request(`/product/${productId}/copy`, {
            method: 'POST',
            body: JSON.stringify({ token }),
        })
    }
}

// Singleton instance
export const digiseller = new DigisellerClient()
