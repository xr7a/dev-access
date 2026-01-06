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
    CardFooter,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, Search, CheckCircle2, XCircle, Package } from 'lucide-react'
import { format } from 'date-fns'

const formSchema = z.object({
    code: z.string().min(1, 'Please enter your unique code'),
})

interface PaymentInfo {
    inv: number
    id_goods: number
    amount: number
    date_pay: string
    email: string
    options?: { id: number; name: string; value: string }[]
}

export default function VerifyPaymentPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
    const [errorMessage, setErrorMessage] = useState('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setStatus('loading')
        setPaymentInfo(null)
        try {
            const res = await fetch('/api/orders/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || 'Payment not found')
            }

            setPaymentInfo(result)
            setStatus('success')
        } catch (error) {
            setStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
        }
    }

    return (
        <div className="container max-w-lg py-20 min-h-[calc(100vh-200px)]">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Check Order Status
                    </CardTitle>
                    <CardDescription>
                        Enter the unique code you received after payment to verify your order.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Unique Code (e.g. 1234567890ABCDEF)"
                                    {...form.register('code')}
                                />
                            </div>
                            <Button type="submit" disabled={status === 'loading'}>
                                {status === 'loading' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Check'
                                )}
                            </Button>
                        </div>
                        {form.formState.errors.code && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.code.message}
                            </p>
                        )}
                    </form>

                    <div className="mt-6">
                        {status === 'success' && paymentInfo && (
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-green-600 font-medium">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span>Payment Verified</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            #{paymentInfo.inv}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-muted-foreground">Date:</div>
                                        <div>{format(new Date(paymentInfo.date_pay), 'PP p')}</div>

                                        <div className="text-muted-foreground">Amount:</div>
                                        <div>{paymentInfo.amount}</div>

                                        <div className="text-muted-foreground">Email:</div>
                                        <div>{paymentInfo.email}</div>

                                        <div className="text-muted-foreground">Product ID:</div>
                                        <div>{paymentInfo.id_goods}</div>
                                    </div>

                                    {paymentInfo.options && paymentInfo.options.length > 0 && (
                                        <div className="pt-2 border-t">
                                            <div className="text-sm font-medium mb-1">Options:</div>
                                            <ul className="text-sm space-y-1">
                                                {paymentInfo.options.map((opt) => (
                                                    <li key={opt.id}>
                                                        <span className="text-muted-foreground">{opt.name}: </span>
                                                        {opt.value}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>Verification Failed</AlertTitle>
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="justify-center text-xs text-muted-foreground">
                    If you have issues, please contact support.
                </CardFooter>
            </Card>
        </div>
    )
}
