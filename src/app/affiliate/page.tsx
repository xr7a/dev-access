import { Card, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Users, ArrowLeft, Percent, TrendingUp, Wallet, Gift, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Партнёрская программа',
    description: 'Зарабатывайте с DevAccess! Получайте 15% с каждой продажи по вашей реферальной ссылке. Партнёрская программа для блогеров и вебмастеров.',
    keywords: ['партнёрская программа', 'реферальная программа', 'заработок', 'DevAccess'],
    alternates: {
        canonical: '/affiliate',
    },
}

const benefits = [
    {
        icon: Percent,
        title: '15% комиссия',
        description: 'С каждой продажи по вашей реферальной ссылке',
    },
    {
        icon: Wallet,
        title: 'Быстрые выплаты',
        description: 'Выплаты от 500₽ на карту или электронный кошелёк',
    },
    {
        icon: TrendingUp,
        title: 'Статистика в реальном времени',
        description: 'Отслеживайте переходы и продажи в личном кабинете',
    },
    {
        icon: Gift,
        title: 'Бонусы для топ-партнёров',
        description: 'Повышенные ставки для активных партнёров',
    },
]

const steps = [
    {
        step: 1,
        title: 'Зарегистрируйтесь',
        description: 'Создайте аккаунт на сайте — это займёт меньше минуты',
    },
    {
        step: 2,
        title: 'Получите ссылку',
        description: 'В личном кабинете вы найдёте уникальную реферальную ссылку',
    },
    {
        step: 3,
        title: 'Делитесь ссылкой',
        description: 'Размещайте ссылку в соцсетях, блоге, на YouTube или Telegram',
    },
    {
        step: 4,
        title: 'Получайте доход',
        description: '15% от каждой покупки по вашей ссылке зачисляется на баланс',
    },
]

export default function AffiliatePage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
            {/* Breadcrumb */}
            <Link
                href="/"
                className="mb-6 inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                На главную
            </Link>

            {/* Hero */}
            <div className="text-center mb-12">
                <div className="inline-flex p-4 bg-violet-500/10 rounded-2xl mb-6">
                    <Users className="h-12 w-12 text-violet-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                    Партнёрская программа
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Зарабатывайте вместе с нами! Получайте <span className="text-violet-400 font-semibold">15% комиссии</span> с каждой продажи
                    по вашей реферальной ссылке.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                        <Button size="lg">
                            Стать партнёром
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="lg">
                            У меня есть аккаунт
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Benefits */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
                {benefits.map((benefit) => (
                    <Card key={benefit.title} className="p-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                            <benefit.icon className="h-6 w-6 text-violet-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                        <p className="text-sm text-slate-400">{benefit.description}</p>
                    </Card>
                ))}
            </div>

            {/* How it works */}
            <Card className="p-8 mb-12">
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                    Как это работает
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((item) => (
                        <div key={item.step} className="text-center">
                            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold">
                                {item.step}
                            </div>
                            <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* FAQ */}
            <Card className="p-8 mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-white mb-2">Когда начисляется комиссия?</h3>
                        <p className="text-slate-400">
                            Комиссия начисляется сразу после успешной оплаты заказа по вашей реферальной ссылке.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Какая минимальная сумма для вывода?</h3>
                        <p className="text-slate-400">
                            Минимальная сумма для вывода — 500 рублей. Выплаты производятся в течение 3 рабочих дней.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Как долго сохраняется реферальная привязка?</h3>
                        <p className="text-slate-400">
                            Cookie-метка сохраняется 30 дней. Если пользователь совершит покупку в этот период,
                            вы получите комиссию.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Могу ли я рекламировать любые товары?</h3>
                        <p className="text-slate-400">
                            Да, комиссия начисляется за любой товар из каталога DevAccess.
                        </p>
                    </div>
                </div>
            </Card>

            {/* CTA */}
            <div className="text-center">
                <p className="text-slate-400 mb-4">
                    Присоединяйтесь к сотням партнёров, которые уже зарабатывают с DevAccess
                </p>
                <Link href="/register">
                    <Button size="lg">
                        Начать зарабатывать
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
