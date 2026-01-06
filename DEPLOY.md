# DevAccess — Деплой

## Быстрый старт

```bash
# 1. Создать .env файл
cat > .env << 'EOF'
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:your_secure_password@db:5432/devaccess
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_APP_URL=https://your-domain.com
DIGISELLER_SELLER_ID=your_seller_id
DIGISELLER_API_KEY=your_api_key
EOF

# 2. Запустить
docker compose -f docker-compose.prod.yml up -d --build

# 3. Миграция БД
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# 4. Синхронизация товаров
docker compose -f docker-compose.prod.yml exec app node -e "require('./src/lib/sync').syncDigisellerProducts()"
```

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `POSTGRES_PASSWORD` | Пароль PostgreSQL |
| `DATABASE_URL` | Строка подключения к БД |
| `NEXTAUTH_URL` | URL сайта (https://...) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Публичный URL |
| `DIGISELLER_SELLER_ID` | ID продавца Digiseller |
| `DIGISELLER_API_KEY` | API ключ Digiseller |

## ЮKassa

Настраивается в кабинете Digiseller: **Настройки → Способы оплаты → ЮKassa**

## Команды

```bash
# Логи
docker compose -f docker-compose.prod.yml logs -f app

# Перезапуск
docker compose -f docker-compose.prod.yml restart app

# Обновление
git pull && docker compose -f docker-compose.prod.yml up -d --build

# Бэкап БД
docker compose -f docker-compose.prod.yml exec db pg_dump -U postgres devaccess > backup.sql
```

## Cron (автосинхронизация)

```bash
0 */6 * * * cd /opt/devaccess && docker compose -f docker-compose.prod.yml exec -T app node -e "require('./src/lib/sync').syncDigisellerProducts()" >> /var/log/sync.log 2>&1
```
