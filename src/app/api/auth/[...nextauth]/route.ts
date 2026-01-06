import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Пароль', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Введите email и пароль')
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) {
                    throw new Error('Пользователь не найден')
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error('Неверный пароль')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    referralCode: user.referralCode,
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.referralCode = user.referralCode
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.referralCode = token.referralCode as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
