# AI Session 01 — Book Feature Implementation

**Огноо:** 2025-01-18  
**Зорилго:** BookRepository болон book.routes.ts үүсгэх

---

## Session агуулга (товч)

**Prompt 1:**
> TypeScript + better-sqlite3 ашиглаж BookRepository class бич. 
> findAll (search parameter-тэй), findById, findByIsbn, create, update, delete функцтэй байх.

**Claude хариу:**
- Repository class template үүсгэсэн
- `db.prepare().all()`, `.get()`, `.run()` method ашигласан
- Search-д `LIKE ?` ашиглаж, `%${search}%` pattern зааж өгсөн

**Анзаарсан асуудал:**
- Claude анхандаа `SELECT *` ашигласан — CLAUDE.md-ийн no-go zones-д зааж өгсөн байсан тул засагдсан
- Column бүрийг нэрлэж бичихийг зааж өгсөн

**Prompt 2:**
> ISBN duplicate-г route handler дотор шалгах code бич

**Claude хариу:**
```typescript
const existing = bookRepo.findByIsbn(isbn);
if (existing) {
  return res.status(409).json({ success: false, error: 'ISBN already exists' });
}
```

**Ашигласан:** Тэр даруй нэгтгэсэн, 409 Conflict status зөв байсан.

---

## Сурсан зүйл

- `better-sqlite3`-ийн `.prepare().all()` нь array буцаадаг, `.get()` нь нэг row
- TypeScript-д `as Book[]` type assertion хэрэгтэй болдог
- CLAUDE.md-д no-go zone бичсэн нь AI-д хязгаар тавихад тусалсан
