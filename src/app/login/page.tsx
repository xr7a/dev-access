'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LogIn, Zap } from 'lucide-react'
import { Button, Card, CardContent, Input } from '@/components/ui'

const loginSchema = z.object({
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                setError(result.error)
            } else {
                router.push(callbackUrl)
                router.refresh()
            }
        } catch {
            setError('Произошла ошибка при входе')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardContent className="p-8">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600">
                            <Zap className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Вход в аккаунт</h1>
                        <p className="mt-2 text-slate-400">
                            Для партнёров и администраторов
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            type="email"
                            label="Email"
                            placeholder="partner@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            type="password"
                            label="Пароль"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Войти
                        </Button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center text-sm">
                        <p className="text-slate-400">
                            Нет аккаунта?{' '}
                            <Link href="/register" className="text-violet-400 hover:underline">
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
