interface WebsiteJsonLdProps {
    name: string
    url: string
    description?: string
    searchUrl?: string
}

export function WebsiteJsonLd({
    name,
    url,
    description,
    searchUrl,
}: WebsiteJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url,
        ...(description && { description }),
        ...(searchUrl && {
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: searchUrl,
                },
                'query-input': 'required name=search_term_string',
            },
        }),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
