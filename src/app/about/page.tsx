import { Card, CardContent } from '@/components/ui'
import { User, FileText, Shield, Clock, Mail } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'О нас',
    description: 'Информация о продавце DevAccess. Официальный самозанятый продавец цифровых товаров. Контакты и реквизиты.',
    keywords: ['DevAccess', 'контакты', 'о нас', 'продавец', 'реквизиты'],
    openGraph: {
        title: 'О нас | DevAccess',
        description: 'Информация о продавце DevAccess. Контакты и реквизиты.',
    },
    alternates: {
        canonical: '/about',
    },
}

export default function AboutPage() {
    const sellerInfo = {
        name: 'Десятов Иван Вячеславович',
        status: 'Самозанятый',
        inn: '561208321092',
        email: 'ivandesyatov3@gmail.com',
        workHours: 'Пн-Вс: 10:00 - 22:00 (МСК)',
        responseTime: 'до 24 часов'
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">О нас</h1>
                <p className="text-lg text-slate-400">
                    Добро пожаловать в DevAccess — магазин цифровых товаров
                </p>
            </div>

            {/* About Section */}
            <Card className="mb-8">
                <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-violet-500/10 rounded-xl">
                            <User className="h-6 w-6 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Информация о продавце</h2>
                            <p className="text-slate-400 text-sm">
                                Официально зарегистрированный {sellerInfo.status.toLowerCase()}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <User className="h-4 w-4" />
                                <span>Продавец</span>
                            </div>
                            <p className="text-white font-medium">{sellerInfo.name}</p>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <FileText className="h-4 w-4" />
                                <span>Статус</span>
                            </div>
                            <p className="text-white font-medium">{sellerInfo.status}</p>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded-lg md:col-span-2">
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <FileText className="h-4 w-4" />
                                <span>ИНН</span>
                            </div>
                            <p className="text-white font-medium font-mono">{sellerInfo.inn}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contacts Section */}
            <Card className="mb-8">
                <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Mail className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Контакты</h2>
                            <p className="text-slate-400 text-sm">
                                Свяжитесь с нами по email
                            </p>
                        </div>
                    </div>

                    <a
                        href={`mailto:${sellerInfo.email}`}
                        className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
                    >
                        <div className="p-2 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
                            <Mail className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Email</p>
                            <p className="text-white font-medium">{sellerInfo.email}</p>
                        </div>
                    </a>
                </CardContent>
            </Card>
            {/* Work Info */}
            <Card>
                <CardContent className="p-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Clock className="h-5 w-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Время работы</p>
                                <p className="text-white font-medium">{sellerInfo.workHours}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Clock className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Время ответа</p>
                                <p className="text-white font-medium">{sellerInfo.responseTime}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Безопасные сделки через Digiseller</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Моментальная доставка</span>
                </div>
            </div>

            {/* Back Link */}
            <div className="mt-8 text-center">
                <Link
                    href="/products"
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                    ← Вернуться к каталогу
                </Link>
            </div>
        </div>
    )
}
