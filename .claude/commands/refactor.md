# /refactor — Code Refactoring Assistant

Энэ кодыг дараах зарчмуудаар refactor хий.

## Шалгах зарчмууд

### SOLID
- **S** — Single Responsibility: нэг функц нэг л зүйл хийж байна уу?
- **O** — Open/Closed: шинэ feature нэмэхэд одоо байгаа кодыг өөрчлөх хэрэгтэй юу?
- **L** — Liskov: interface/type нийцтэй байна уу?
- **I** — Interface Segregation: хэт том interface байна уу?
- **D** — Dependency Inversion: concrete class-аас хамаарч байна уу?

### DRY (Don't Repeat Yourself)
- Давтагдсан код байна уу? Helper функт болгох боломжтой юу?
- Copy-paste хэсэг байна уу?

### Clean Code
- Функц нэр нь юу хийдгийг тодорхой илэрхийлж байна уу?
- Нэг функц ≤20 мөр байна уу?
- Magic number/string байна уу? (тогтмол болгох)
- Early return ашиглаж nested if/else багасгаж болох уу?

### TypeScript-specific
- `any` type байна уу? Зөв type нэмэх
- Optional chaining (`?.`) ашиглах боломж байна уу?
- Type guard хэрэгтэй юу?

## Хариулах форм
```typescript
// BEFORE
[одоогийн код]

// AFTER  
[refactored код]

// Тайлбар: [яагаад энэ refactor сайн болсон]
```

## Анхааруулга
- Функциональ байдлыг өөрчлөхгүй
- Тест давуулсан эсэхийг шалга
- Refactor болгон дараа `npm test` ажиллуул