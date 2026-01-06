interface OrganizationJsonLdProps {
    name: string
    url: string
    logo?: string
    email?: string
    description?: string
}

export function OrganizationJsonLd({
    name,
    url,
    logo,
    email,
    description,
}: OrganizationJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        ...(logo && { logo }),
        ...(email && {
            contactPoint: {
                '@type': 'ContactPoint',
                email,
                contactType: 'customer service',
                availableLanguage: ['Russian', 'English'],
            },
        }),
        ...(description && { description }),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
