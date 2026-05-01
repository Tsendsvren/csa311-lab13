# AI Planning Session — plan.md

**Огноо:** 2026-04-30 - 2026-05-01  
**Хэрэгсэл:** Claude (Anthropic)  
**Зорилго:** Stack сонголт, архитектур, CLAUDE.md агуулга

---

## Session 1: Stack харьцуулалт

**Prompt:**
> Mini library API-д зориулж 3 өөр TypeScript stack харьцуул: Node+Express, 
> Node+Fastify, Deno+Oak. SQLite ашиглах, жижиг проект, Jest тест шаардлагатай.

**Claude хариу (товч):**
- Express: Хамгийн танил, том ecosystem, supertest нийцтэй, better-sqlite3 дэмжинэ
- Fastify: Хурдан, built-in schema validation, swagger plugin сайн, plugin сурахад нэмэлт цаг
- Deno: Native TS, security-first, гэхдээ better-sqlite3 ажиллахгүй, Jest байхгүй

**Шийдвэр:** Express — тест хэрэгсэл, SQLite нийцэмж шийдэгч хүчин зүйл болсон.

---

## Session 2: Архитектур зураглал

**Prompt:**
> Mini library системд ямар layer-үүд хэрэгтэй вэ? Routes, controllers, 
> repositories хэрхэн зохион байгуулах вэ?

**Claude хариу (товч):**
- Route → Controller → Repository → DB гэсэн 4 давхарга санал болгосон
- Repository pattern: SQL query-г controller-аас тусгаарлана
- Controller: input validate, response format
- Middleware: errorHandler, requestLogger, validate helper

**Ашигласан санаа:** Repository pattern — SQL-г controller-д бичихгүй байх зарчим маш зөв.

---

## Session 3: Database schema

**Prompt:**
> SQLite-д books, members, loans хүснэгт хэрхэн зохион байгуулах вэ? 
> Ном олон хувь байвал яах вэ?

**Claude хариу (товч):**
- `books` хүснэгтэд `total_copies`, `available_copies` талбар нэмэхийг санал болгосон
- `loans` хүснэгтэд `status` (active/returned/overdue) талбар
- `loan_date`, `due_date`, `return_date` гурвыг тусад нь хадгалах
- Зээлэхэд `available_copies` шинэчлэх, буцаахад нэмэгдүүлэх

**Hallucination анзаарсан:** Claude эхэндээ `CASCADE DELETE` зөвлөснийг зогсоосон — 
буцаасан ном-ын loan record устах нь буруу бизнес логик.

**Засвар:** `ON DELETE RESTRICT` ашиглаж, ном устгахаас өмнө loan шалгах шаардлагатай.

---

## Session 4: CLAUDE.md агуулга

**Prompt:**
> CLAUDE.md-д ямар зүйл орох ёстой вэ? Build command, convention, no-go zones.

**Claude хариу (товч):**
- No-go zones: eval(), plain text password, SELECT *, stack trace expose
- Conventions: camelCase файл, RESTful endpoint, ApiResponse<T> wrapper
- Build: npm run dev/build/test/lint командууд

**Ашигласан:** Бүх санаа CLAUDE.md-д тусгасан, зарим зүйл (AUTH) scope-оос хассан.

---

## Ерөнхий дүгнэлт

AI planning session-аас авсан үнэ цэнтэй зүйлс:
1. Repository pattern-ийг сонгохдоо AI-аас баталгаажуулалт авсан
2. `CASCADE DELETE` буруу гэдгийг өөрөө олж засах хэрэгтэй болсон
3. `available_copies` хандлага энгийн бөгөөд зөв

AI-ийн санал болгосон боловч ашиглаагүй зүйлс:
- JWT authentication (scope-оос хэтэрнэ)
- Redis cache (жижиг проектод хэрэггүй)
- PostgreSQL (SQLite хангалттай)