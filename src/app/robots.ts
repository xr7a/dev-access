import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devaccess.ru'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/login',
                    '/register',
                    '/dashboard',
                    '/verify',
                    '/purchase/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
