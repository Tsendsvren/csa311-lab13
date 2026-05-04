# ADR-002: Overdue Detection — Cron Job vs Request-time Check

**Огноо:** 2026-05-04
**Статус:** Accepted
**Шийдвэр гаргагч:** Оюутан (AI-тай ярилцан)

---

## Нөхцөл байдал (Context)

Түрээсийн хугацаа (`due_date`) өнгөрсөн боловч `status = 'active'` байгаа бүртгэлүүдийг `overdue` болгох шаардлагатай. Хоёр хандлага авч үзсэн:

1. **Cron Job**: Тогтмол цагаар (жишээ нь шөнө 00:00) бүх active loan-г шалгаж status шинэчлэх
2. **Request-time**: GET /api/loans эсвэл GET /api/dashboard дуудах бүрт `markOverdue()` ажиллуулах

---

## AI-тай ярилцлага (товч)

**Асуулт:** "Overdue-г хэзээ шинэчлэх нь зөв вэ? Cron job эсвэл request-д?"

**Claude хариу:**
- Production-д cron job (node-cron, Bull queue) зөв
- Жижиг проектод request-time илүү хялбар
- Hybrid: request-time шалгах + background job нэмж болно

**Эргэлт:** "node-cron суулгахыг зөвлөж байна уу?" - Claude зөвлөсөн. Гэхдээ scope-ыг харгалзвал хэт их complexity.

---

## Авч үзсэн сонголтууд

### Сонголт A: Cron Job (node-cron)
```typescript
cron.schedule('0 0 * * *', () => loanRepo.markOverdue());
```
**Давуу:** Production-д зөв, тогтмол ажиллана
**Сул:** Нэмэлт dependency, жижиг проектод overkill, тест хийхэд хэцүү

### Сонголт B: Request-time (сонгосон)
```typescript
// GET /api/loans-д
loanRepo.markOverdue();
const loans = loanRepo.findAll();
```
**Давуу:** Хялбар, dependency нэмэхгүй, тест хийхэд хялбар
**Сул:** Хэрэглэгч GET хийхгүй бол overdue шинэчлэгдэхгүй

---

## Шийдвэр (Decision)

**Request-time check** сонгосон - GET /api/loans болон GET /api/dashboard-д `markOverdue()` дуудна.

## Үндэслэл (Rationale)

- Жижиг номын санд хэн нэгэн `GET /api/loans` дуудахгүйгээр overdue мэдэгдэл хэрэгтэй болох нөхцөл бодитой биш
- `node-cron` нэмэх нь dependency, server lifecycle, тест complexity нэмнэ
- Даалгаврын scope-д server-side scheduler шаардагдаагүй
- `markOverdue()`-г тестлэхэд request-time хандлага хялбар

## Үр дагавар (Consequences)

**Сайн:** Хялбар, тест хийхэд тохиромжтой, нэмэлт dependency байхгүй
**Муу:** Production-д GET хийхгүй бол overdue шинэчлэгдэхгүй - cron job-р сольж болно
