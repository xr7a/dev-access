import { Card, CardContent } from '@/components/ui'
import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Политика конфиденциальности',
    description: 'Политика конфиденциальности магазина DevAccess. Информация о сборе, хранении и обработке персональных данных.',
    alternates: {
        canonical: '/privacy',
    },
}

export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
            {/* Breadcrumb */}
            <Link
                href="/"
                className="mb-6 inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                На главную
            </Link>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-500/10 rounded-xl">
                    <Shield className="h-6 w-6 text-green-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Политика конфиденциальности</h1>
                    <p className="text-slate-400 text-sm mt-1">Последнее обновление: 6 января 2025 г.</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-8 prose prose-invert max-w-none">
                    <h2 className="text-xl font-semibold text-white mb-4">1. Сбор информации</h2>
                    <p className="text-slate-300 mb-4">
                        При использовании сайта DevAccess мы можем собирать следующую информацию:
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                        <li>Email-адрес (для доставки товаров и связи)</li>
                        <li>Данные о заказах и платежах</li>
                        <li>IP-адрес и данные браузера (для аналитики)</li>
                        <li>Cookies для улучшения работы сайта</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white mb-4">2. Использование информации</h2>
                    <p className="text-slate-300 mb-4">
                        Собранная информация используется для:
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                        <li>Обработки и доставки заказов</li>
                        <li>Связи с покупателем по вопросам заказа</li>
                        <li>Улучшения качества сервиса</li>
                        <li>Предотвращения мошенничества</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white mb-4">3. Защита данных</h2>
                    <p className="text-slate-300 mb-6">
                        Мы принимаем все необходимые меры для защиты ваших персональных данных:
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                        <li>Шифрование данных при передаче (SSL/TLS)</li>
                        <li>Безопасное хранение информации</li>
                        <li>Ограниченный доступ к персональным данным</li>
                        <li>Регулярное обновление систем безопасности</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white mb-4">4. Передача данных третьим лицам</h2>
                    <p className="text-slate-300 mb-6">
                        Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением:
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                        <li>Платёжных систем для обработки транзакций (Digiseller)</li>
                        <li>Случаев, предусмотренных законодательством РФ</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white mb-4">5. Файлы cookie</h2>
                    <p className="text-slate-300 mb-6">
                        Сайт использует cookies для хранения настроек пользователя и аналитики.
                        Вы можете отключить cookies в настройках браузера, однако это может повлиять
                        на функциональность сайта.
                    </p>

                    <h2 className="text-xl font-semibold text-white mb-4">6. Права пользователя</h2>
                    <p className="text-slate-300 mb-4">
                        Вы имеете право:
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                        <li>Запросить информацию о хранящихся данных</li>
                        <li>Потребовать исправления неточных данных</li>
                        <li>Запросить удаление ваших данных</li>
                        <li>Отозвать согласие на обработку данных</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white mb-4">7. Контакты</h2>
                    <p className="text-slate-300">
                        По вопросам конфиденциальности обращайтесь: <a href="mailto:ivandesyatov3@gmail.com" className="text-violet-400 hover:text-violet-300">ivandesyatov3@gmail.com</a>
                    </p>
                </CardContent>
            </Card>

            {/* Related Links */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
                <Link href="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Пользовательское соглашение
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="/refund" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Возврат средств
                </Link>
            </div>
        </div>
    )
}
