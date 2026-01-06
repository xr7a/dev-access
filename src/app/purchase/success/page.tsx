import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { digiseller } from '@/lib/digiseller'

// Server Component that fetches data
async function SuccessContent({ searchParams }: { searchParams: Promise<{ uniquecode?: string }> }) {
    const { uniquecode } = await searchParams

    if (!uniquecode) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
                <p className="text-slate-400">Код подтверждения отсутствует.</p>
                <Link href="/" className="mt-8 inline-block">
                    <Button variant="outline">На главную</Button>
                </Link>
            </div>
        )
    }

    // Verify purchase with Digiseller
    let purchase: any = null
    try {
        purchase = await digiseller.findPaymentByCode(uniquecode)
    } catch (e) {
        console.error('Failed to verify code', e)
    }

    if (!purchase || purchase.retval !== 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-amber-500 mb-4">Платеж проверяется</h1>
                <p className="text-slate-400 max-w-md mx-auto">
                    Мы пока не получили подтверждение от Digiseller.
                    Если деньги списались, проверьте вашу почту — товар придет туда.
                </p>
                <Link href="/" className="mt-8 inline-block">
                    <Button variant="outline">На главную</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-500/20 p-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">Спасибо за покупку!</h1>

            <p className="text-lg text-slate-300 mb-8">
                Ваш заказ <span className="text-white font-mono">#{purchase.inv}</span> успешно оплачен.
            </p>

            <Card className="p-6 bg-slate-900/50 border-slate-800 mb-8 text-left">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-slate-500">Товар</p>
                        <p className="text-lg font-medium text-white">{purchase.name_goods}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Email получателя</p>
                        <p className="text-white">{purchase.options?.find((o: any) => o.name === 'email')?.value || 'Email скрыт'}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                        <p className="text-sm text-slate-400">
                            Товар и инструкции отправлены на вашу почту.
                            Также вы можете забрать товар в личном кабинете Digiseller.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="flex justify-center gap-4">
                <Link href="/">
                    <Button variant="secondary">В магазин</Button>
                </Link>
                <a href="https://my.digiseller.com/inside/my_purchases.asp" target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                        Мои покупки Digiseller
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </a>
            </div>
        </div>
    )
}

export default function PurchaseSuccessPage(props: { searchParams: Promise<{ uniquecode?: string }> }) {
    return (
        <div className="container mx-auto px-4 py-16">
            <Suspense fallback={
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }>
                <SuccessContent searchParams={props.searchParams} />
            </Suspense>
        </div>
    )
}
