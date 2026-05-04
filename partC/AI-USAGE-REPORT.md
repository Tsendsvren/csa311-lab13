# AI Usage Report — Mini Library System

**Огноо:** 2026-04-29 – 2026-05-04  
**Хэрэгсэл:** Claude (Anthropic) — claude.ai  
**Нийт session:** 8+ удаа  
**Үг тоо:** ~1800 үг

---

## 1. Юуг AI хийсэн, юуг өөрөө хийсэн?

### А хэсэг (Төлөвлөлт)

**AI хийсэн:**
- 3 stack-ийн харьцуулалт хийж давуу/сул талыг жагсаасан (STACK-COMPARISON.md-ийн агуулгын 70%)
- Mermaid диаграмын syntax зааж, layer диаграмын outline гаргасан
- ADR форматыг санал болгосон (Context/Decision/Rationale/Consequences бүтэц)
- CLAUDE.md-д no-go zones жагсаасан (`eval()`, `SELECT *`, гэх мэт)

**Өөрөө хийсэн:**
- Эцсийн stack сонголтын шийдвэр (Express — supertest нийцэмжийн шалтгаанаар)
- Business scope тодорхойлох (authentication хасах, энгийн frontend нэмэх)
- Mermaid диаграмыг бодит модулийнхаа нэрээр засварлах
- ADR-001-ийн эцсийн утгыг өөрийн үгээр бичих

### Б хэсэг (Хэрэгжилт)

**AI хийсэн:**
- Repository pattern-ийн TypeScript кодын template үүсгэсэн
- SQLite migration SQL-ийн бүтэц санал болгосон
- `better-sqlite3` transaction хэрхэн ашиглахыг харуулсан
- Тестийн `beforeEach` / `afterEach` бүтэц санал болгосон
- Error middleware-ийн бүтэц

**Өөрөө хийсэн:**
- CASCADE DELETE-ийн алдааг олж засах
- `available_copies` логик зөв ажиллаж байгааг тестээр баталгаажуулах
- Бизнес дүрмийг тодорхойлох (идэвхгүй гишүүн түрээсэлж болохгүй, хэт олон түрээс гэх мэт)
- Endpoint бүрийн validation логик тохируулах
- Тест 20+ кейс зохиох

### В хэсэг (Эргэцүүлэл)

**AI хийсэн:** Бичих template санал болгосон  
**Өөрөө хийсэн:** Бүх агуулгыг бичсэн — AI-ийн алдаа, туршлагын дүгнэлт хувийн байх ёстой

---

## 2. Hallucination 2+ жишээ

### Жишээ 1: CASCADE DELETE буруу зөвлөсөн

**AI санал болгосон:**
```sql
REFERENCES books(id) ON DELETE CASCADE
```

**Асуудал:** Энэ нь ном устгахад тухайн номын бүх түрээсийн бүртгэл мөн устна. Номын сангийн систем дэх түрээсийн түүх маш чухал мэдэгдэл. "Ном буцааж авсны дараа устгасан" гэх мэт тохиолдолд бүртгэл алдагдана.

**Яаж олсон:** Database schema зохион байгуулахдаа "ном устгавал яах вэ?" гэж бодоод loan record-ийн ач холбогдлыг ойлгосон. AI-аас асуусан: "loan record устгасан нь зөв үү?" гэтэл тэр "history preservation чухал" гэж зөвшөөрсөн — ингэж эхний саналаасаа татгалзсан.

**Засвар:** `ON DELETE RESTRICT` ашиглаж, ном устгахаас өмнө active loan шалгах логик нэмсэн.

---

### Жишээ 2: `setupFilesAfterFramework` буруу field нэр

**AI санал болгосон (package.json Jest config):**
```json
"setupFilesAfterFramework": []
```

**Асуудал:** Jest-ийн зөв field нэр нь `setupFilesAfterFramework` биш — `setupFilesAfterEnv`. AI-ийн санал болгосон утга Jest-д танигдахгүй, тест ажилладаг ч тохируулга ignored болдог.

**Яаж олсон:** `npm test` ажиллуулахад warning гарсан. Jest баримтжуулалтаас шалгасан.

**Засвар:** `setupFilesAfterEnv` болгон засав.

---

### Жишээ 3: `express-async-errors` import буруу зааж өгсөн

**AI санал болгосон:**
```typescript
import asyncErrors from 'express-async-errors';
asyncErrors(app);
```

**Асуудал:** `express-async-errors` нь function export хийдэггүй — `import 'express-async-errors'` гэж side-effect import хийхэд л хангалттай. Default export байхгүй.

**Яаж олсон:** TypeScript компилятор алдаа гаргасан. npm package-ийн README-г шалгасан.

**Засвар:** `import 'express-async-errors'` болгон засав.

---

## 3. Security / License-ийн анхаарал

### Security жишээ: Integer parsing шалгаагүй

**AI үүсгэсэн анхны код:**
```typescript
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = bookRepo.findById(id);
  ...
});
```

**Асуудал:** `parseInt('abc')` нь `NaN` буцаадаг. `NaN`-г `findById`-д дамжуулбал SQLite-д `NULL` болж хувирч, тодорхойгүй зан төлөвтэй болно.

**Засвар:** 
```typescript
if (isNaN(id)) {
  res.status(400).json({ success: false, error: 'Invalid ID' });
  return;
}
```

Тест нэмж баталгаажуулсан: `GET /api/books/abc` → 400.

### License: `better-sqlite3` MIT лицензтэй
`npm audit` ажиллуулсан — алдаа илрээгүй. Бүх dependency MIT эсвэл ISC лицензтэй.

---

## 4. AI-аар хурдан хийсэн зүйлс

- **Repository pattern template** — `BookRepository`-ийн CRUD функц бүрийг дангаараа бичих 30+ минут зарцуулна байсан. AI 2 минутад draft үүсгэсэн.
- **Mermaid syntax** — диаграмын синтаксыг мэдэхгүй байсан, AI жишээ аргументтайгаар харуулсан.
- **Jest config** — `ts-jest` preset тохируулах — баримтжуулалт уншихаас хурдан болсон.
- **SQL migration** — index нэмэх, constraint бичих SQL syntax хурдан гарсан.

---

## 5. AI-аар удаан/хэцүү байсан зүйлс

- **Transaction логик** — `better-sqlite3`-ийн transaction API-г AI буруу харуулсан (Promise-based гэж бодсон, гэтэл synchronous). Баримтжуулалт унших хэрэгтэй болсон.
- **Test isolation** — `beforeEach`-д database reset хийх логик AI хэд хэдэн буруу санал оруулсан. In-memory DB (`':memory:'`) шийдэл өөрөө олсон.
- **Overdue автомат шалгалт** — "GET хийх үед overdue болгох уу эсвэл cron job ашиглах уу?" гэсэн архитектурын шийдвэрийг AI тодорхой хариулгүй 2-3 өөр санал оруулсан. Өөрөө шийдвэр гаргах хэрэгтэй болсон (GET-д markOverdue() дуудах).

---

## 6. Skill Atrophy эрсдэл — Яаж зохицуулсан?

**Эрсдэл:** AI-тай ажиллахад "яаж хийх вэ" гэх ойлголт багасч, зөвхөн "AI-д хэл" сэтгэлгээ үүсч болно.

**Хийсэн арга хэмжээ:**

1. **"AI байхгүй" цаг:** Тест бичихдээ AI ашиглаагүйгээр өөрөө бичсэн — 10-аас 6 тестийг дангаараа зохион бичсэн. Ингэснээр `supertest` API-г өөрөө ойлгосон.

2. **Кодыг тайлбарлах дадлага:** AI үүсгэсэн функц бүрийг унших, өөртөө тайлбарлах дадал гаргасан. Тайлбарлаж чадахгүй бол AI-аас асуулт тавих биш — баримтжуулалт уншсан.

3. **Repository pattern ойлгох:** AI template өгсний дараа "яагаад ийм бүтэц?" гэж AI-аас асуун ойлгосон. Дараа нь LoanRepository-г бие даан бичсэн.

4. **Шалгалтын бэлтгэл:** "Шалгалт өнөөдөр болбол энэ кодыг тайлбарлаж чадах уу?" гэдгийг өдөр бүр өөртөө асуусан. Үгүй гэвэл тэр хэсгийг дахин уншсан.

**Дүгнэлт:** AI бол хурдны хэрэгсэл — ойлголтын орлуулагч биш. Тест бичих, debug хийх, архитектурын шийдвэр гаргах — эдгээр нь хүний ойлголт шаарддаг хэвээр байна.

---

## Ерөнхий дүгнэлт

AI-тай хамтран ажилласан энэ туршлага "verify, don't trust" зарчмыг практикт мэдрэх боломж олгосон. AI хурдан draft гаргадаг ч business logic, constraint, edge case-ийг бүрэн ойлгодоггүй. Хамгийн чухал lesson: **AI санал болгосон бүхнийг "яагаад?" гэж асуух сэтгэлгээ**.
