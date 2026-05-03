# Mini Library System

Номын сан удирдлагын REST API + хялбар frontend.

## Онцлог
- Номын бүртгэл (CRUD + хайх)
- Гишүүн удирдлага
- Түрээсийн хяналт (түрээслэх, буцаах, хугацаа)
- Dashboard статистик

## Суулгах

```bash
cd partB
npm install
copy .env.example .env
npm run dev
```

## Ажиллуулах

```bash
npm run dev      # Development (port 3000)
npm run build    # TypeScript compile
npm start        # Production
```

## Тест

```bash
npm test                 # Бүх тест
npm run test:coverage    # Coverage тайлан
```

## API Endpoints

| Method | Path | Тайлбар |
|--------|------|---------|
| GET | /api/books | Бүх ном |
| POST | /api/books | Ном нэмэх |
| GET | /api/books/:id | Нэг ном |
| PUT | /api/books/:id | Ном засах |
| DELETE | /api/books/:id | Ном устгах |
| GET | /api/members | Бүх гишүүн |
| POST | /api/members | Гишүүн нэмэх |
| GET | /api/loans | Бүх зээл |
| POST | /api/loans | Зээлэх |
| PUT | /api/loans/:id/return | Буцаах |
| GET | /api/dashboard | Статистик |

## Stack
- Node.js + Express + TypeScript
- SQLite (better-sqlite3)
- Jest + supertest