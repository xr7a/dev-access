import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email и пароль обязательны' },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'Пользователь с таким email уже существует' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'PARTNER', // All new users are partners
            },
        })

        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                referralCode: user.referralCode,
            },
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Ошибка при регистрации' },
            { status: 500 }
        )
    }
}
