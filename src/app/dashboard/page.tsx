import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Users, Link as LinkIcon, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { CopyButton } from '@/components/ui/copy-button'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { formatPrice } from '@/lib/utils'
import prisma from '@/lib/prisma'

async function getPartnerStats(userId: string) {
    const stats = await prisma.referralStat.aggregate({
        where: { userId },
        _sum: {
            clicks: true,
            conversions: true,
            earned: true,
        },
    })

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true, referralCode: true },
    })

    return {
        totalClicks: stats._sum.clicks || 0,
        totalConversions: stats._sum.conversions || 0,
        totalEarned: Number(stats._sum.earned || 0),
        balance: Number(user?.balance || 0),
        referralCode: user?.referralCode || '',
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const stats = await getPartnerStats(session.user.id)
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${stats.referralCode}`

    const statCards = [
        {
            title: 'Переходы',
            value: stats.totalClicks.toString(),
            icon: TrendingUp,
            color: 'text-blue-400',
        },
        {
            title: 'Продажи',
            value: stats.totalConversions.toString(),
            icon: Users,
            color: 'text-emerald-400',
        },
        {
            title: 'Заработано',
            value: formatPrice(stats.totalEarned),
            icon: DollarSign,
            color: 'text-violet-400',
        },
        {
            title: 'Баланс',
            value: formatPrice(stats.balance),
            icon: BarChart3,
            color: 'text-amber-400',
        },
    ]

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Привет, {session.user.name || 'Партнёр'}!
                </h1>
                <p className="mt-2 text-slate-400">
                    Ваш партнёрский кабинет
                </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">{stat.title}</p>
                                    <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div className={`rounded-xl bg-slate-800 p-3 ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Referral Link */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-violet-400" />
                        Ваша реферальная ссылка
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={referralLink}
                            readOnly
                            className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-white"
                        />
                        <CopyButton text={referralLink} />
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                        Делитесь этой ссылкой и получайте 15% с каждой продажи!
                    </p>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/dashboard/affiliate">
                    <Card className="cursor-pointer transition-colors hover:border-violet-500/50">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-violet-600/20 p-3">
                                <BarChart3 className="h-6 w-6 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Статистика</h3>
                                <p className="text-sm text-slate-400">Подробная аналитика</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {session.user.role === 'ADMIN' && (
                    <Link href="/admin">
                        <Card className="cursor-pointer transition-colors hover:border-violet-500/50">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-xl bg-amber-600/20 p-3">
                                    <Users className="h-6 w-6 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Админ-панель</h3>
                                    <p className="text-sm text-slate-400">Управление магазином</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}
            </div>
        </div>
    )
}
