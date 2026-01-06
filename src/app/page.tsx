import Link from 'next/link'
import {
  Zap,
  Shield,
  Clock,
  CreditCard,
  ArrowRight,
  Sparkles,
  Bot,
  Code,
  Palette,
  Music,
  Brain,
  ChevronDown
} from 'lucide-react'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { FAQPageJsonLd } from '@/components/seo'

// Mock categories
const categories = [
  { name: 'Нейросети', slug: 'ai', icon: Brain, count: 24, color: 'from-violet-500 to-purple-600' },
  { name: 'Разработка', slug: 'dev', icon: Code, count: 18, color: 'from-blue-500 to-cyan-600' },
  { name: 'Дизайн', slug: 'design', icon: Palette, count: 12, color: 'from-pink-500 to-rose-600' },
  { name: 'Медиа', slug: 'media', icon: Music, count: 15, color: 'from-orange-500 to-amber-600' },
]

// Mock popular products
const popularProducts = [
  {
    id: '1',
    title: 'ChatGPT Plus - 1 месяц',
    shortDesc: 'Доступ к GPT-4, DALL-E 3, и расширенным функциям',
    price: 1990,
    discountPrice: 1490,
    category: 'Нейросети',
    imageUrl: '/images/chatgpt.png',
    salesCount: 342,
  },
  {
    id: '2',
    title: 'Midjourney - Подписка',
    shortDesc: 'Безлимитная генерация изображений',
    price: 2490,
    category: 'Нейросети',
    imageUrl: '/images/midjourney.png',
    salesCount: 256,
  },
  {
    id: '3',
    title: 'GitHub Copilot - 1 год',
    shortDesc: 'AI-ассистент для программирования',
    price: 9900,
    discountPrice: 7900,
    category: 'Разработка',
    imageUrl: '/images/copilot.png',
    salesCount: 189,
  },
  {
    id: '4',
    title: 'Figma Professional',
    shortDesc: 'Полный доступ к Figma Pro функциям',
    price: 1200,
    category: 'Дизайн',
    imageUrl: '/images/figma.png',
    salesCount: 145,
  },
]

const features = [
  {
    icon: Clock,
    title: 'Мгновенная доставка',
    description: 'Автоматическая выдача товара сразу после оплаты',
  },
  {
    icon: Shield,
    title: 'Безопасные платежи',
    description: 'Все транзакции защищены через Digiseller',
  },
  {
    icon: CreditCard,
    title: 'Удобная оплата',
    description: 'Карты, электронные кошельки, криптовалюта',
  },
  {
    icon: Zap,
    title: 'Поддержка 24/7',
    description: 'Оперативная помощь в Telegram и email',
  },
]

const faq = [
  {
    question: 'Как происходит доставка товара?',
    answer: 'После оплаты товар автоматически отправляется на вашу электронную почту. Обычно это занимает от 1 до 5 минут.',
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем банковские карты (Visa, MasterCard, МИР), электронные кошельки (QIWI, ЮMoney), а также криптовалюту.',
  },
  {
    question: 'Можно ли вернуть товар?',
    answer: 'Возврат возможен в течение 24 часов с момента покупки, если товар не был использован. Подробнее в разделе "Возврат средств".',
  },
  {
    question: 'Как стать партнёром?',
    answer: 'Зарегистрируйтесь на сайте и получите уникальную реферальную ссылку. Вы будете получать 15% с каждой продажи по вашей ссылке.',
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function HomePage() {
  return (
    <>
      {/* FAQ Structured Data */}
      <FAQPageJsonLd items={faq} />

      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-transparent to-transparent" />
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-6">
                <Sparkles className="mr-1 h-3 w-3" />
                Более 500 цифровых товаров
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Цифровые товары для{' '}
                <span className="text-gradient">профессионалов</span>
              </h1>

              <p className="mt-6 text-lg text-slate-400 sm:text-xl">
                Подписки на нейросети, ключи к программам, аккаунты сервисов.
                Мгновенная доставка после оплаты.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Смотреть каталог
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/affiliate">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Партнёрская программа
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Категории товаров
              </h2>
              <p className="mt-4 text-slate-400">
                Выберите интересующую категорию
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {categories.map((category) => (
                <Link key={category.slug} href={`/products?category=${category.slug}`}>
                  <Card className="group cursor-pointer p-6 text-center transition-transform hover:-translate-y-1">
                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color}`}>
                      <category.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {category.count} товаров
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Products Section */}
        <section className="py-16 lg:py-24 bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Популярные товары
                </h2>
                <p className="mt-4 text-slate-400">
                  Самые востребованные цифровые продукты
                </p>
              </div>
              <Link href="/products" className="hidden sm:block">
                <Button variant="ghost">
                  Все товары
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="group h-full overflow-hidden transition-transform hover:-translate-y-1">
                    {/* Image placeholder */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Bot className="h-16 w-16 text-slate-700" />
                      </div>
                      {product.discountPrice && (
                        <Badge variant="destructive" className="absolute left-3 top-3">
                          Скидка
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                        {product.shortDesc}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          {product.discountPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-white">
                                {formatPrice(product.discountPrice)}
                              </span>
                              <span className="text-sm text-slate-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-white">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {product.salesCount} продаж
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/products">
                <Button variant="outline">
                  Все товары
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Почему выбирают нас
              </h2>
              <p className="mt-4 text-slate-400">
                Удобный сервис для покупки цифровых товаров
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20">
                    <feature.icon className="h-7 w-7 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-slate-900/50">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Частые вопросы
              </h2>
              <p className="mt-4 text-slate-400">
                Ответы на популярные вопросы
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="group">
                  <summary className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-colors hover:border-slate-700">
                    <span className="font-medium text-white">{item.question}</span>
                    <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/30 p-5">
                    <p className="text-slate-400">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <Card className="relative overflow-hidden p-8 lg:p-12">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl" />

              <div className="relative text-center">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Зарабатывай с нами
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-slate-400">
                  Присоединяйся к партнёрской программе и получай 15% с каждой продажи по твоей реферальной ссылке
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/register">
                    <Button size="lg">
                      Стать партнёром
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/affiliate">
                    <Button variant="outline" size="lg">
                      Подробнее о программе
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}
