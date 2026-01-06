import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui'
import { User, Shield, Mail } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Пользователи</h1>
                <span className="text-slate-400">Всего: {users.length}</span>
            </div>

            {users.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-slate-400">
                        Пользователей пока нет
                    </CardContent>
                </Card>
            ) : (
                <div className="rounded-lg border border-slate-800 bg-slate-900/50">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="p-4 font-medium">Пользователь</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Роль</th>
                                <th className="p-4 font-medium">Дата регистрации</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-800/50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                                                <User className="h-5 w-5 text-violet-400" />
                                            </div>
                                            <span className="font-medium text-white">
                                                {user.name || 'Без имени'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Mail className="h-4 w-4 text-slate-500" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${user.role === 'ADMIN'
                                                ? 'bg-violet-500/10 text-violet-400'
                                                : 'bg-slate-500/10 text-slate-400'
                                            }`}>
                                            {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                                            {user.role === 'ADMIN' ? 'Админ' : 'Пользователь'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
