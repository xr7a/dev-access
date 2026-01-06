/**
 * Smart Product Ranking System
 * 
 * Balances multiple factors:
 * - Popularity (25%) - sales velocity
 * - Quality (30%) - review ratio
 * - Newness (20%) - boost for new products
 * - Promotion (15%) - paid advertising (limited)
 * - Random (10%) - fair chance for all
 */

interface RankingInput {
    createdAt: Date
    salesCount: number
    digisellerSalesCount: number
    positiveReviews: number
    negativeReviews: number
    promotionLevel: number // 0-3
    viewsCount: number
    productId: string
}

// Weights for each factor (must sum to 1.0)
const WEIGHTS = {
    popularity: 0.25,
    quality: 0.30,
    newness: 0.20,
    promotion: 0.15,
    random: 0.10,
}

// Max % of products on a page that can be "promoted"
export const MAX_PROMOTED_RATIO = 0.3

/**
 * Calculate newness factor (boost for new products)
 * Exponential decay over 14 days
 */
export function getNewnessFactor(createdAt: Date): number {
    const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceCreation <= 3) return 1.0      // First 3 days - maximum boost
    if (daysSinceCreation <= 7) return 0.7      // Days 4-7
    if (daysSinceCreation <= 14) return 0.4     // Days 8-14
    if (daysSinceCreation <= 30) return 0.2     // Days 15-30
    return 0.05                                  // After 30 days - minimal
}

/**
 * Calculate quality score from reviews
 * Returns 0-1 where 1 is best quality
 */
export function getQualityFactor(positiveReviews: number, negativeReviews: number): number {
    const totalReviews = positiveReviews + negativeReviews

    if (totalReviews === 0) return 0.5 // Neutral for products without reviews

    // Wilson score lower bound (more accurate than simple ratio)
    // Simplified version
    const ratio = positiveReviews / totalReviews
    const confidence = Math.min(totalReviews / 50, 1) // Max confidence at 50+ reviews

    // Blend towards neutral for low review counts
    return 0.5 + (ratio - 0.5) * confidence
}

/**
 * Calculate popularity factor from sales
 * Normalized using logarithmic scale
 */
export function getPopularityFactor(salesCount: number, maxSales: number): number {
    if (maxSales === 0) return 0.5

    // Log scale to prevent top sellers from dominating
    const logSales = Math.log10(salesCount + 1)
    const logMax = Math.log10(maxSales + 1)

    return logSales / logMax
}

/**
 * Get promotion factor (0-1)
 */
export function getPromotionFactor(level: number): number {
    // level 0 = no promotion, level 3 = max
    return Math.min(level, 3) / 3
}

/**
 * Deterministic random factor that changes hourly
 * Same product gets same random value within the hour
 */
export function getRandomFactor(productId: string, hourSeed?: number): number {
    const seed = hourSeed ?? Math.floor(Date.now() / (1000 * 60 * 60))
    const hash = simpleHash(`${productId}-${seed}`)
    return (hash % 100) / 100
}

function simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash)
}

/**
 * Calculate final ranking score (0-100)
 */
export function calculateRankingScore(
    input: RankingInput,
    maxSalesInCatalog: number
): number {
    const popularity = getPopularityFactor(
        input.salesCount + input.digisellerSalesCount,
        maxSalesInCatalog
    )

    const quality = getQualityFactor(
        input.positiveReviews,
        input.negativeReviews
    )

    const newness = getNewnessFactor(input.createdAt)
    const promotion = getPromotionFactor(input.promotionLevel)
    const random = getRandomFactor(input.productId)

    const score =
        popularity * WEIGHTS.popularity +
        quality * WEIGHTS.quality +
        newness * WEIGHTS.newness +
        promotion * WEIGHTS.promotion +
        random * WEIGHTS.random

    // Normalize to 0-100
    return Math.round(score * 100 * 100) / 100
}

/**
 * Apply promotion limit to a list of products
 * Ensures promoted products don't exceed MAX_PROMOTED_RATIO
 */
export function limitPromotedProducts<T extends { promotionLevel: number; rankingScore: number }>(
    products: T[],
    pageSize: number
): T[] {
    const maxPromoted = Math.floor(pageSize * MAX_PROMOTED_RATIO)

    // Separate promoted and regular
    const promoted = products.filter(p => p.promotionLevel > 0)
    const regular = products.filter(p => p.promotionLevel === 0)

    // Sort each by ranking score
    promoted.sort((a, b) => b.rankingScore - a.rankingScore)
    regular.sort((a, b) => b.rankingScore - a.rankingScore)

    // Take limited promoted + rest from regular
    const limitedPromoted = promoted.slice(0, maxPromoted)
    const remainingSlots = pageSize - limitedPromoted.length
    const limitedRegular = regular.slice(0, remainingSlots)

    // Merge and re-sort by score
    return [...limitedPromoted, ...limitedRegular]
        .sort((a, b) => b.rankingScore - a.rankingScore)
}

/**
 * Calculate scores for all products in batch
 */
export function calculateBatchRankingScores(
    products: RankingInput[]
): Map<string, number> {
    // Find max sales for normalization
    const maxSales = Math.max(
        ...products.map(p => p.salesCount + p.digisellerSalesCount),
        1
    )

    const scores = new Map<string, number>()

    for (const product of products) {
        scores.set(product.productId, calculateRankingScore(product, maxSales))
    }

    return scores
}
