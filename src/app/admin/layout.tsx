import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Package, Users, BarChart3 } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6 hidden md:block">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-white tracking-wider">АДМИН</h1>
                </div>

                <nav className="space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
                        <LayoutDashboard className="h-5 w-5" />
                        Главная
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
                        <ShoppingBag className="h-5 w-5" />
                        Товары
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
                        <Package className="h-5 w-5" />
                        Заказы
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
                        <Users className="h-5 w-5" />
                        Пользователи
                    </Link>
                    <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
                        <BarChart3 className="h-5 w-5" />
                        Аналитика
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
                        <Settings className="h-5 w-5" />
                        Настройки
                    </Link>
                </nav>

                <div className="absolute bottom-6 left-6">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors">
                        <LogOut className="h-5 w-5" />
                        На сайт
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
