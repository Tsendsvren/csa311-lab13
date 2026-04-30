# STACK-COMPARISON.md — Stack Харьцуулалт

## AI-тай хийсэн харьцуулалт

AI-д дараах prompt өгсөн:
> "Mini library API-д зориулж 3 өөр TypeScript stack харьцуул: (1) Node+Express, 
> (2) Node+Fastify, (3) Deno+Oak. SQLite ашиглах, жижиг проект, сурагчийн ажил."

---

## 3 Stack Харьцуулалт

| Шалгуур | Node.js + Express | Node.js + Fastify | Deno + Oak |
|---------|------------------|-------------------|------------|
| **Хэрэглэхэд хялбар** | ⭐⭐⭐⭐⭐ Маш танил | ⭐⭐⭐⭐ Танил | ⭐⭐ Шинэ орчин |
| **TypeScript дэмжлэг** | ⭐⭐⭐⭐ @types шаардагдана | ⭐⭐⭐⭐⭐ Built-in | ⭐⭐⭐⭐⭐ Native |
| **Ecosystem** | ⭐⭐⭐⭐⭐ npm маш том | ⭐⭐⭐⭐⭐ npm | ⭐⭐⭐ Жижиг |
| **SQLite интеграци** | ⭐⭐⭐⭐⭐ better-sqlite3 | ⭐⭐⭐⭐⭐ better-sqlite3 | ⭐⭐⭐ npm compat |
| **Performance** | ⭐⭐⭐⭐ Хангалттай | ⭐⭐⭐⭐⭐ Маш хурдан | ⭐⭐⭐⭐ Сайн |
| **Баримтжуулалт** | ⭐⭐⭐⭐⭐ Маш их | ⭐⭐⭐⭐ Сайн | ⭐⭐⭐ Хязгаарлагдмал |
| **Jest тест** | ⭐⭐⭐⭐⭐ Supertest | ⭐⭐⭐⭐⭐ Дэмжинэ | ⭐⭐⭐ Өөр тест хэрэгсэл |
| **OpenAPI auto-gen** | ⭐⭐⭐⭐⭐ swagger-autogen | ⭐⭐⭐⭐⭐ @fastify/swagger | ⭐⭐⭐ Хязгаарлагдмал |
| **Сурах тохиром** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## Дэлгэрэнгүй шинжилгээ

### 1. Node.js + Express + TypeScript
**Давуу тал:**
- Хамгийн өргөн хэрэглэгддэг — асуудал гарвал Stack Overflow дүүрэн хариулт
- `better-sqlite3` маш сайн дэмжлэгтэй, synchronous API — async complexity байхгүй
- `supertest` + `jest` хослол тест бичихэд хялбар
- `swagger-autogen` эсвэл `tsoa` ашиглаж OpenAPI автомат гаргах боломж

**Сул тал:**
- TypeScript-ийн type definition-ийг тусад нь суулгах (`@types/express`)
- Express 4 нь Promise error-ийг автомат catch хийхгүй (Express 5 шийдсэн)
- Middleware зарим тохиолдолд verbose

### 2. Node.js + Fastify + TypeScript
**Давуу тал:**
- Express-ээс 2-3x хурдан (benchmark-аар)
- TypeScript-тэй нэгдмэл — type definition built-in
- `@fastify/swagger` — OpenAPI-г маш хялбар гаргана
- Schema validation built-in (JSON Schema)

**Сул тал:**
- Plugin architecture заримдаа confusing
- Express-тэй харьцуулахад хамт олны жишээ бага
- `supertest`-ийн оронд `fastify.inject()` ашиглана — өөр workflow

### 3. Deno + Oak + TypeScript
**Давуу тал:**
- TypeScript native — transpile хийхгүй, шууд ажиллана
- Security-first: file/network access тус бүр зөвшөөрөл хэрэгтэй
- Built-in formatter, linter, test runner

**Сул тал:**
- npm ecosystem-тэй нийцэмж бүрэн биш (`better-sqlite3` ажиллахгүй)
- `deno_sqlite` package нь `better-sqlite3`-тай харьцуулахад функц дутуу
- Баримтжуулалт болон жишээ хязгаарлагдмал
- Jest, supertest ашиглах боломжгүй — тест workflow огт өөр

---

## Сонгосон Stack: **Node.js + Express + TypeScript**

### Сонголтын үндэслэл

**Үндсэн шалтгаан:**

1. **Суралцах боломж** — Express хамгийн их баримтжуулалттай. Асуудал гарвал хариулт олоход хялбар. Сурагчийн проект тул энэ чухал.

2. **SQLite нийцэмж** — `better-sqlite3` Express-тэй маш жигд ажилладаг. Synchronous API нь async/await complexity хэрэггүй болгодог — код унших, debug хийхэд хялбар.

3. **Тест хэрэгсэл** — `Jest` + `supertest` хослол нь HTTP endpoint тест бичихэд хамгийн хялбар. Daалгавар ≥10 unit test шаарддаг тул энэ давуу тал чухал.

4. **OpenAPI** — `swagger-autogen` эсвэл `tsoa` ашиглаж `/api-docs` endpoint автоматаар үүсгэнэ.

5. **Fastify-г яагаад сонгоогүй** — Fastify нь performance-аар давуу ч жижиг номын санд 2-3x хурдан байх шаардлагагүй. Plugin системийг сурахад нэмэлт цаг зарцуулах хэрэгтэй.

6. **Deno-г яагаад сонгоогүй** — `better-sqlite3` ажиллахгүй, Jest ашиглах боломжгүй. Бие даалтын шаардлагыг биелүүлэхэд хэт олон бэрхшээл.

### AI-ын санал
Claude-аас авсан зөвлөгөө: *"Express-ийн хамгийн том давуу тал нь асуудлыг 
хэрхэн шийдсэн жишээ интернэтэд дүүрэн байдаг. Сурагчийн проектод энэ чухал. 
Fastify production-д давуу, гэхдээ тест бичих, debug хийх дадлага олоход Express 
илүү."*

**Эцсийн шийдвэр:** Express — суралцахад хялбар, тест хэрэгсэл бэлэн, SQLite нийцэмж сайн.