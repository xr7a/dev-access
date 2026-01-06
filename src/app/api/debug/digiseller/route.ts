import { NextResponse } from 'next/server'
import { digiseller } from '@/lib/digiseller'
import prisma from '@/lib/prisma'

export async function GET() {
    try {

        const digiList = await digiseller.getProducts({ rows: 5 })

        // Test explicit fetch with the user's provided ID
        const TEST_ID = '1427846'
        const rawResponse = await fetch(`https://api.digiseller.com/api/categories?seller_id=${TEST_ID}&format=json`, {
            headers: { 'Accept': 'application/json' }
        }).then(r => r.json())

        // Also test the old method
        const categories = await digiseller.getCategories()

        return NextResponse.json({
            listItems: digiList.products,
            categories,
            rawResponse_1427846: rawResponse
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
