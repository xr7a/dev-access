// Deprecated: Categories are now managed via Database and Digiseller Sync
// This file is kept only if we need fallback hardcoded values for initial dev,
// but the main application now uses prisma.category.findMany()

export interface CategoryConfig {
    slug: string
    name_ru: string
    name_en: string
    icon: any
    keywords: string[]
}

// Keeping empty or minimal for type safety if imported elsewhere, but should be unused
export const PRODUCT_CATEGORIES: CategoryConfig[] = []

export function getCategoryName(slug: string, lang: 'ru' | 'en' = 'ru') {
    return slug // Dynamic system uses DB names
}
