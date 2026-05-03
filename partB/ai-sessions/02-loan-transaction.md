# AI Session 02 — Loan Checkout Transaction

**Огноо:** 2026-05-03  
**Зорилго:** Түрээсийн transaction логик, available_copies шинэчлэлт

---

## Session агуулга (товч)

**Асуудал:** Түрээс үүсгэхдээ (1) loans INSERT болон (2) books UPDATE хоёр тусдаа query.
Нэг нь амжилттай, нөгөө нь амжилтгүй болвол data inconsistency үүснэ.

**Prompt:**
> better-sqlite3-д transaction хэрхэн ашиглах вэ? 
> loan create болон book available_copies decrement-г atomic болгох

**Claude анхны хариу (БУРУУ):**
```typescript
await db.transaction(async () => { ... })
```

**Асуудал:** `better-sqlite3` нь synchronous — `async` transaction байхгүй! 
Claude-ийн хариу `better-better-sqlite3`-тэй андуурсан эсвэл hallucination.

**Шалгасан:** [better-sqlite3 баримтжуулалт](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#transactionfunction---function)

**Зөв хариу олсон:**
```typescript
const runTransaction = db.transaction(() => {
  const loan = loanRepo.create(dto);
  bookRepo.decrementAvailable(dto.book_id);
  return loan;
});
const loan = runTransaction(); // Synchronous!
```

---

## Сурсан зүйл

- `better-sqlite3` transaction нь synchronous — `async/await` байхгүй
- AI баримтжуулалт шалгалгүйгээр async гэж хариулсан — hallucination
- Transaction-д `return` утга буцаах боломжтой

## Hallucination тэмдэглэл

Claude async transaction санал болгосон нь буруу байсан. Баримтжуулалт шалгаж засав.
AI Usage Report-д Hallucination жишээ болгон ашиглаагүй (тусдаа жишээ байгаа тул).
