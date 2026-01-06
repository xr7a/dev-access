'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, Zap } from 'lucide-react'
import { Button, Card, CardContent, Input } from '@/components/ui'

const registerSchema = z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            })

            const result = await response.json()

            if (!result.success) {
                setError(result.error || 'Ошибка регистрации')
                return
            }

            // Redirect to login
            router.push('/login?registered=true')
        } catch {
            setError('Произошла ошибка при регистрации')
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
                        <h1 className="text-2xl font-bold text-white">Регистрация</h1>
                        <p className="mt-2 text-slate-400">
                            Станьте партнёром и зарабатывайте 15% с продаж
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
                            type="text"
                            label="Имя"
                            placeholder="Иван Иванов"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            type="email"
                            label="Email"
                            placeholder="your@email.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            type="password"
                            label="Пароль"
                            placeholder="Минимум 6 символов"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Input
                            type="password"
                            label="Подтвердите пароль"
                            placeholder="••••••••"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Зарегистрироваться
                        </Button>
                    </form>

                    {/* Terms */}
                    <p className="mt-4 text-center text-xs text-slate-500">
                        Регистрируясь, вы соглашаетесь с{' '}
                        <Link href="/terms" className="text-violet-400 hover:underline">
                            условиями использования
                        </Link>
                    </p>

                    {/* Links */}
                    <div className="mt-6 text-center text-sm">
                        <p className="text-slate-400">
                            Уже есть аккаунт?{' '}
                            <Link href="/login" className="text-violet-400 hover:underline">
                                Войти
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
