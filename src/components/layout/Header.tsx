'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, Zap, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui'
// import { useCartStore } from '@/store/cartStore'

const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/products' },
    { name: 'О нас', href: '/about' },

]

export function Header() {
    const { data: session } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    // const itemCount = useCartStore((state) => state.getItemCount())

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                        Dev<span className="text-violet-400">Access</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Cart */}
                    {/* Cart removed for Direct Checkout flow */}


                    {/* Auth */}
                    {session ? (
                        <div className="hidden lg:flex items-center gap-2">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Кабинет
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => signOut()}
                                title="Выйти"
                            >
                                <LogOut className="h-4 w-4 text-red-400" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden lg:block">
                            <Button variant="outline" size="sm">
                                <User className="mr-2 h-4 w-4" />
                                Войти
                            </Button>
                        </Link>
                    )}

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="space-y-1 border-t border-slate-800 px-4 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="my-2 border-t border-slate-800" />

                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block rounded-lg px-3 py-2 text-base font-medium text-violet-400 transition-colors hover:bg-slate-800"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4 inline" />
                                    Личный кабинет
                                </Link>
                                <button
                                    className="w-full text-left rounded-lg px-3 py-2 text-base font-medium text-red-400 transition-colors hover:bg-slate-800"
                                    onClick={() => {
                                        signOut()
                                        setMobileMenuOpen(false)
                                    }}
                                >
                                    <LogOut className="mr-2 h-4 w-4 inline" />
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block rounded-lg px-3 py-2 text-base font-medium text-violet-400 transition-colors hover:bg-slate-800"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Войти
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
