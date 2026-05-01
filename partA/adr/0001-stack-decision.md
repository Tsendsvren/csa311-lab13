# ADR-001: Stack сонголт — Node.js + Express + TypeScript + SQLite

**Огноо:** 2025-01-15  
**Статус:** Accepted  
**Шийдвэр гаргагч:** Оюутан (AI-тай хамтран)

---

## Нөхцөл байдал (Context)

Mini Library систем бүтээхэд тохирох backend stack сонгох шаардлагатай болсон.
Шалгуурууд:
- TypeScript дэмжлэг
- SQLite-тэй сайн нийцэх
- Jest + supertest-ээр тест бичих боломж
- OpenAPI 3.0 spec гаргах боломж
- Суралцахад хялбар, баримтжуулалт хангалттай

## Авч үзсэн сонголтууд

1. Node.js + Express + TypeScript
2. Node.js + Fastify + TypeScript
3. Deno + Oak + TypeScript

## Шийдвэр (Decision)

**Node.js + Express + TypeScript + SQLite (better-sqlite3)** сонгосон.

## Үндэслэл (Rationale)

- Express нь хамгийн өргөн хэрэглэгддэг — асуудал гарвал шийдлийг хурдан олно
- `better-sqlite3` synchronous API нь async complexity багасгана
- `supertest` + `jest` хослол endpoint тест бичихэд хамгийн хялбар
- Fastify performance давуу ч жижиг проектод ялгаа мэдэгдэхгүй
- Deno нь `better-sqlite3` дэмжихгүй — тест workflow огт өөр болно

## Үр дагавар (Consequences)

**Сайн:**
- Хурдан эхлэх боломж — Express middleware маш сайн мэддэг
- npm ecosystem бүрэн ашиглах боломж
- Тест бичих хялбар

**Муу:**
- TypeScript type definition тусад нь (`@types/express`, `@types/node`) суулгах
- Express 4 нь Promise error автоматаар catch хийхгүй — `asyncHandler` wrapper хэрэгтэй

## AI-ын оролцоо

Claude-д 3 stack харьцуулж, давуу/сул талыг жагсаалуулсан. Эцсийн шийдвэрийг 
оюутан бие даан гаргасан — Express-ийг сонгосон үндсэн шалтгаан нь тест хэрэгслийн 
нийцэмж (`supertest`) ба SQLite-ийн `better-sqlite3`.