import { Card, CardContent, Skeleton } from '@/components/ui'

/**
 * Skeleton loader for ProductContent while Digiseller API is loading.
 * Shows a nice loading state instead of blocking the page.
 */
export function ProductContentSkeleton() {
    return (
        <div className="space-y-6">
            {/* Tabs skeleton */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-28 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* Content skeleton */}
            <Card>
                <CardContent className="p-6 lg:p-8 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="pt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>
        </div>
    )
}
