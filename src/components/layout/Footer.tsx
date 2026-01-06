import Link from 'next/link'
import { Zap, Mail, MessageCircle } from 'lucide-react'

const footerLinks = {
    shop: [
        { name: 'Каталог', href: '/products' },
        { name: 'Популярные', href: '/products?sort=popular' },
        { name: 'Новинки', href: '/products?sort=new' },
    ],
    company: [
        { name: 'О нас', href: '/about' },

        { name: 'Партнёрам', href: '/affiliate' },
    ],
    legal: [
        { name: 'Пользовательское соглашение', href: '/terms' },
        { name: 'Политика конфиденциальности', href: '/privacy' },
        { name: 'Возврат средств', href: '/refund' },
    ],
}

export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Dev<span className="text-violet-400">Access</span>
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-slate-400">
                            Цифровые товары для профессионалов. Мгновенная доставка, безопасные платежи.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <a
                                href="mailto:ivandesyatov3@gmail.com"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="https://t.me/ivandesyatov3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                            >
                                <MessageCircle className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white">Магазин</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 transition-colors hover:text-white"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">Компания</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 transition-colors hover:text-white"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">Правовая информация</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 transition-colors hover:text-white"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 border-t border-slate-800 pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} DevAccess. Все права защищены.
                        </p>
                        <p className="text-sm text-slate-500">
                            Платежи обрабатываются через{' '}
                            <a
                                href="https://digiseller.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-400 hover:text-violet-300"
                            >
                                Digiseller
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
