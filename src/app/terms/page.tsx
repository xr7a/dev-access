import { Card, CardContent } from '@/components/ui'
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Пользовательское соглашение',
    description: 'Пользовательское соглашение магазина DevAccess. Условия использования сайта и покупки цифровых товаров.',
    alternates: {
        canonical: '/terms',
    },
}

export default function TermsPage() {
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
                <div className="p-3 bg-violet-500/10 rounded-xl">
                    <FileText className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Пользовательское соглашение</h1>
                    <p className="text-slate-400 text-sm mt-1">Последнее обновление: 6 января 2025 г.</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-8 prose prose-invert max-w-none">
                    <h2 className="text-xl font-semibold text-white mb-4">1. Общие положения</h2>
                    <p className="text-slate-300 mb-6">
                        Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между
                        Продавцом (Самозанятый Десятов Иван Вячеславович, ИНН 561208321092) и Покупателем при приобретении
                        цифровых товаров через сайт DevAccess.
                    </p>

                    <h2 className="text-xl font-semibold text-white mb-4">2. Предмет соглашения</h2>
                    <p className="text-slate-300 mb-4">
                        Продавец предоставляет Покупателю цифровые товары, включая, но не ограничиваясь:
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                        <li>Подписки на программное обеспечение и сервисы</li>
                        <li>Лицензионные ключи активации</li>
                        <li>Учётные записи (аккаунты) различных сервисов</li>
                        <li>Цифровой контент и материалы</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white mb-4">3. Порядок оформления заказа</h2>
                    <p className="text-slate-300 mb-6">
                        3.1. Покупатель выбирает товар на сайте и оформляет заказ.<br />
                        3.2. После оплаты товар доставляется автоматически на указанный email.<br />
                        3.3. Время доставки составляет от 1 до 5 минут после подтверждения оплаты.<br />
                        3.4. Платежи обрабатываются через платёжную систему Digiseller.
                    </p>

                    <h2 className="text-xl font-semibold text-white mb-4">4. Права и обязанности сторон</h2>
                    <p className="text-slate-300 mb-4">
                        <strong className="text-white">Продавец обязуется:</strong>
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                        <li>Предоставить товар надлежащего качества</li>
                        <li>Обеспечить своевременную доставку после оплаты</li>
                        <li>Оказывать техническую поддержку покупателям</li>
                    </ul>
                    <p className="text-slate-300 mb-4">
                        <strong className="text-white">Покупатель обязуется:</strong>
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                        <li>Предоставить корректные контактные данные для доставки</li>
                        <li>Использовать приобретённые товары в соответствии с их назначением</li>
                        <li>Не передавать товары третьим лицам без согласия Продавца</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white mb-4">5. Гарантии и ответственность</h2>
                    <p className="text-slate-300 mb-6">
                        5.1. Продавец гарантирует работоспособность товара на момент продажи.<br />
                        5.2. В случае проблем с товаром Покупатель вправе обратиться в поддержку.<br />
                        5.3. Продавец не несёт ответственности за блокировку аккаунтов по вине Покупателя.
                    </p>

                    <h2 className="text-xl font-semibold text-white mb-4">6. Контактная информация</h2>
                    <p className="text-slate-300">
                        По всем вопросам обращайтесь: <a href="mailto:ivandesyatov3@gmail.com" className="text-violet-400 hover:text-violet-300">ivandesyatov3@gmail.com</a>
                    </p>
                </CardContent>
            </Card>

            {/* Related Links */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
                <Link href="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Политика конфиденциальности
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="/refund" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Возврат средств
                </Link>
            </div>
        </div>
    )
}
