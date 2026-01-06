import { Card, CardContent } from '@/components/ui'
import Link from 'next/link'
import { RotateCcw, ArrowLeft, CheckCircle, XCircle, Clock, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Возврат средств',
    description: 'Условия возврата средств за цифровые товары в магазине DevAccess. Гарантии и правила возврата.',
    alternates: {
        canonical: '/refund',
    },
}

export default function RefundPage() {
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
                <div className="p-3 bg-amber-500/10 rounded-xl">
                    <RotateCcw className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Возврат средств</h1>
                    <p className="text-slate-400 text-sm mt-1">Условия и порядок возврата</p>
                </div>
            </div>

            {/* Key Points */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="p-4 text-center">
                    <Clock className="h-8 w-8 text-violet-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">24 часа</p>
                    <p className="text-sm text-slate-400">Срок подачи заявки</p>
                </Card>
                <Card className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">Быстро</p>
                    <p className="text-sm text-slate-400">Рассмотрение до 24ч</p>
                </Card>
                <Card className="p-4 text-center">
                    <Mail className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">Email</p>
                    <p className="text-sm text-slate-400">Заявка на возврат</p>
                </Card>
            </div>

            <Card className="mb-6">
                <CardContent className="p-8">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        Когда возврат возможен
                    </h2>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex items-start gap-3">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>Товар не соответствует описанию на сайте</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>Товар не работает с момента получения</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>Товар не был доставлен в течение 24 часов</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>Дублирующийся заказ (случайная повторная оплата)</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="p-8">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-400" />
                        Когда возврат невозможен
                    </h2>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Товар был использован (ключ активирован, аккаунт задействован)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Прошло более 24 часов с момента покупки</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Блокировка по вине покупателя (нарушение правил сервиса)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>Изменение личного решения после активации</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Как оформить возврат</h2>
                    <ol className="space-y-4 text-slate-300">
                        <li className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-400">1</span>
                            <div>
                                <p className="font-medium text-white">Напишите на email</p>
                                <p className="text-sm">Отправьте письмо на <a href="mailto:ivandesyatov3@gmail.com" className="text-violet-400 hover:text-violet-300">ivandesyatov3@gmail.com</a></p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-400">2</span>
                            <div>
                                <p className="font-medium text-white">Укажите детали</p>
                                <p className="text-sm">Номер заказа, email покупки, причину возврата</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-400">3</span>
                            <div>
                                <p className="font-medium text-white">Ожидайте ответа</p>
                                <p className="text-sm">Мы рассмотрим заявку в течение 24 часов</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-400">4</span>
                            <div>
                                <p className="font-medium text-white">Получите возврат</p>
                                <p className="text-sm">Средства вернутся тем же способом, которым была произведена оплата</p>
                            </div>
                        </li>
                    </ol>
                </CardContent>
            </Card>

            {/* Related Links */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
                <Link href="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Пользовательское соглашение
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Политика конфиденциальности
                </Link>
            </div>
        </div>
    )
}
