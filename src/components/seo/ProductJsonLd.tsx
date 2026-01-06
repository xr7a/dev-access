interface ProductJsonLdProps {
    name: string
    description: string
    image: string
    price: number
    originalPrice?: number
    currency: string
    url: string
    category: string
    rating?: number
    reviewCount?: number
}

export function ProductJsonLd({
    name,
    description,
    image,
    price,
    originalPrice,
    currency,
    url,
    category,
    rating,
    reviewCount,
}: ProductJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image,
        category,
        offers: {
            '@type': 'Offer',
            price: price.toFixed(2),
            priceCurrency: currency,
            availability: 'https://schema.org/InStock',
            url,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            ...(originalPrice && {
                priceSpecification: {
                    '@type': 'PriceSpecification',
                    price: originalPrice.toFixed(2),
                    priceCurrency: currency,
                    valueAddedTaxIncluded: true,
                }
            }),
        },
        ...(rating && reviewCount && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: rating.toFixed(1),
                reviewCount,
                bestRating: '5',
                worstRating: '1',
            },
        }),
        brand: {
            '@type': 'Organization',
            name: 'DevAccess',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
