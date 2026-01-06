import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { Providers } from "@/components/providers";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devaccess.ru';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "DevAccess - Цифровые товары",
    template: "%s | DevAccess",
  },
  description:
    "Магазин цифровых товаров для профессионалов. Подписки, ключи, аккаунты. Мгновенная доставка после оплаты.",
  keywords: [
    "цифровые товары",
    "подписки",
    "ключи",
    "аккаунты",
    "ChatGPT",
    "нейросети",
    "программы",
    "купить подписку",
    "Midjourney",
    "GitHub Copilot",
  ],
  authors: [{ name: "DevAccess" }],
  creator: "DevAccess",
  publisher: "DevAccess",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: baseUrl,
    siteName: "DevAccess",
    title: "DevAccess - Цифровые товары",
    description: "Магазин цифровых товаров для профессионалов. Подписки на нейросети, ключи к программам, аккаунты сервисов.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevAccess - Цифровые товары',
    description: 'Магазин цифровых товаров для профессионалов',
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        {/* Global Structured Data */}
        <OrganizationJsonLd
          name="DevAccess"
          url={baseUrl}
          email="ivandesyatov3@gmail.com"
          description="Магазин цифровых товаров для профессионалов. Подписки, ключи, аккаунты."
        />
        <WebsiteJsonLd
          name="DevAccess"
          url={baseUrl}
          description="Магазин цифровых товаров"
          searchUrl={`${baseUrl}/products?search={search_term_string}`}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-slate-950 text-white`}>
        <Providers>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
