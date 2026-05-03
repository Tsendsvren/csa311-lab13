# Mini Library — Б хэсэг (Build)

## Суулгах

```bash
cd partB
npm install
cp .env.example .env
```

## Ажиллуулах

```bash
npm run dev    # Development (ts-node-dev, hot reload)
npm run build  # TypeScript → dist/
npm start      # Production (dist/index.js)
```

## Тест

```bash
npm test               # Бүх тест (in-memory SQLite)
npm run test:coverage  # Coverage тайлан
```

## API Endpoints

### Books
| Method | Path | Тайлбар |
|--------|------|---------|
| GET | /api/books | Бүх ном (`?search=` дэмжинэ) |
| GET | /api/books/:id | Нэг ном |
| POST | /api/books | Ном нэмэх |
| PUT | /api/books/:id | Ном засах |
| DELETE | /api/books/:id | Ном устгах (active loan байвал 409) |

### Members
| Method | Path | Тайлбар |
|--------|------|---------|
| GET | /api/members | Бүх гишүүн (`?search=`, `?status=` дэмжинэ) |
| GET | /api/members/:id | Нэг гишүүн |
| POST | /api/members | Гишүүн нэмэх |
| PUT | /api/members/:id | Гишүүн засах / идэвхгүй болгох |
| DELETE | /api/members/:id | Гишүүн устгах |

### Loans
| Method | Path | Тайлбар |
|--------|------|---------|
| GET | /api/loans | Бүх зээл (`?status=active/returned/overdue`) |
| GET | /api/loans/:id | Нэг зээл |
| POST | /api/loans | Зээлэх (`book_id`, `member_id`, `due_days?`) |
| PUT | /api/loans/:id/return | Буцаах |

### Dashboard
| Method | Path | Тайлбар |
|--------|------|---------|
| GET | /api/dashboard | Статистик нэгтгэл |

## Жишээ хүсэлтүүд

```bash
# Ном нэмэх
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"isbn":"978-9919-0-0001-0","title":"Монгол кодлогч","author":"Б.Болд","total_copies":3}'

# Гишүүн нэмэх
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Болд Баатар","email":"bold@must.edu.mn","phone":"99001122"}'

# Зээлэх
curl -X POST http://localhost:3000/api/loans \
  -H "Content-Type: application/json" \
  -d '{"book_id":1,"member_id":1,"due_days":14}'

# Буцаах
curl -X PUT http://localhost:3000/api/loans/1/return

# Dashboard
curl http://localhost:3000/api/dashboard
```

## Folder бүтэц

```
partB/
├── src/
│   ├── index.ts          # Entry point
│   ├── app.ts            # Express app factory
│   ├── db/
│   │   └── database.ts   # SQLite connection + migrations
│   ├── models/
│   │   └── index.ts      # TypeScript interfaces
│   ├── repositories/
│   │   ├── BookRepository.ts
│   │   ├── MemberRepository.ts
│   │   └── LoanRepository.ts
│   ├── routes/
│   │   ├── book.routes.ts
│   │   ├── member.routes.ts
│   │   ├── loan.routes.ts
│   │   └── dashboard.routes.ts
│   └── middleware/
│       └── errorHandler.ts
├── tests/
│   └── library.test.ts   # 20+ тест
└── ai-sessions/
    ├── 01-book-feature.md
    ├── 02-loan-transaction.md
    └── 03-test-suite.md
```

## Feature жагсаалт

1. **Book CRUD** — бүрэн CRUD + ISBN unique, хайх
2. **Member CRUD** — бүрэн CRUD + email validation, active/inactive
3. **Loan System** — зээлэх, буцаах, overdue автомат илрүүлэлт
4. **Dashboard** — нэгдсэн статистик
5. **Search** — ном болон гишүүнээр хайх
