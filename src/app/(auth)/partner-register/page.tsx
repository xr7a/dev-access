'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const formSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

export default function PartnerRegisterPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setStatus('loading')
        try {
            const res = await fetch('/api/partners/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || 'Registration failed')
            }

            setStatus('success')
        } catch (error) {
            setStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
        }
    }

    return (
        <div className="container max-w-lg py-20">
            <Card>
                <CardHeader>
                    <CardTitle>Partner Registration</CardTitle>
                    <CardDescription>
                        Join our affiliate program and earn commissions by selling our products.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'success' ? (
                        <Alert className="border-green-500 bg-green-50 text-green-800">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Registration Successful!</AlertTitle>
                            <AlertDescription>
                                You have been successfully registered. Please check your email for further instructions from Digiseller.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {status === 'error' && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="partner@example.com"
                                    {...form.register('email')}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Register as Partner
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
