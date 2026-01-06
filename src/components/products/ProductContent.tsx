import { digiseller } from '@/lib/digiseller'
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { FileText, Info, MessageSquare } from 'lucide-react'
import { ProductReviews } from './ProductReviews'

interface ProductContentProps {
    digisellerProductId: string
    fallbackDescription: string
}

/**
 * Server Component that fetches fresh data from Digiseller.
 * This is wrapped in Suspense in the parent, so it streams after initial page load.
 */
export async function ProductContent({ digisellerProductId, fallbackDescription }: ProductContentProps) {
    // Fetch product details and initial reviews count
    let fullDetails = null
    let reviewsData: { reviews: any[]; total: number; pages: number } = { reviews: [], total: 0, pages: 0 }

    try {
        const results = await Promise.all([
            digiseller.getProductDetails(Number(digisellerProductId)),
            digiseller.getReviews(Number(digisellerProductId), 'all', 1, 10).catch(() => ({ reviews: [], total: 0, pages: 0 })),
        ])
        fullDetails = results[0]
        reviewsData = results[1] || { reviews: [], total: 0, pages: 0 }
    } catch (error) {
        console.error('[ProductContent] Error fetching product details:', error)
    }

    const description = fullDetails?.info || fallbackDescription
    const addInfo = fullDetails?.add_info
    const totalReviews = reviewsData?.total || 0

    return (
        <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="description" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Описание
                </TabsTrigger>
                <TabsTrigger value="addinfo" className="gap-2" disabled={!addInfo}>
                    <Info className="h-4 w-4" />
                    Доп. инфо
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Отзывы ({totalReviews})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
                <Card>
                    <CardContent className="p-6 lg:p-8">
                        <div className="prose prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="addinfo" className="mt-6">
                <Card>
                    <CardContent className="p-6 lg:p-8">
                        <div className="prose prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: addInfo || '' }} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
                {/* Client component with load-more pagination */}
                <ProductReviews
                    digisellerId={Number(digisellerProductId)}
                    initialReviews={reviewsData.reviews}
                    initialTotal={totalReviews}
                    initialPages={reviewsData.pages || Math.ceil(totalReviews / 10)}
                />
            </TabsContent>
        </Tabs>
    )
}

