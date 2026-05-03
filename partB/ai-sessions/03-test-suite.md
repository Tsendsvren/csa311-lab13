# AI Session 03 — Test Suite Design

**Огноо:** 2025-01-23  
**Зорилго:** ≥10 unit test, in-memory DB isolation

---

## Session агуулга (товч)

**Асуудал:** Тест бүр тусдаа, ямар ч статуст эхлэх ёстой. File-based DB ашиглавал тест бие биедээ нөлөөлнэ.

**Prompt:**
> Jest-д тест isolation хийх хамгийн зөв арга? 
> SQLite ашигласан Express API-д supertest-тэй хэрхэн тест бичих?

**Claude хариу:**
- In-memory DB (`':memory:'`) санал болгосон — маш зөв
- `beforeEach`-д шинэ DB үүсгэх, `afterEach`-д хаах
- `createTestDb()` factory function хэрэглэх

**Хэрэгжүүлсэн:**
```typescript
beforeEach(() => {
  db = createTestDb(); // ':memory:' SQLite
  bookRepo = new BookRepository(db);
  // router-д inject хийх
  app = buildTestApp(bookRepo, ...);
});

afterEach(() => {
  db.close();
});
```

**AI нэмж санал болгосон (ашигласан):**
- `describe` block-д логик бүлэглэх (Books, Members, Loans)
- Тест нэр `action — expected result` форматаар

**Өөрөө нэмсэн тест кейсүүд (AI санал болгоогүй):**
- `available_copies` зөв буурч байгаа эсэх (түрээсний дараа шалгах)
- Return хийгдсэн түрээсийг дахин return хийх оролдлого (409)
- Хугацааны логик: `due_days` parameter ажиллаж байна уу

---

## Сурсан зүйл

- In-memory SQLite тест isolation-д хамгийн тохиромжтой
- Dependency injection (repo-г inject хийх) тест хийхэд шаардлагатай
- Edge case-ийг өөрөө бодож нэмэх хэрэгтэй — AI стандарт happy path л санал болгодог
