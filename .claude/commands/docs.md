# /docs — Documentation Generator

Энэ кодын баримтжуулалтыг дараах форматаар үүсгэ.

## JSDoc (TypeScript функц бүрд)

```typescript
/**
 * [Функцийн тодорхой тайлбар — юу хийдэг, хэзээ ашиглах]
 * 
 * @param paramName - [параметрийн тайлбар, хүчинтэй утгууд]
 * @returns [буцаах утгын тайлбар]
 * @throws [алдаа гарах нөхцөл]
 * 
 * @example
 * ```typescript
 * const result = functionName(input);
 * // => expected output
 * ```
 */
```

## README хэсэг (endpoint бүрд)

```markdown
### POST /api/endpoint

[Товч тайлбар]

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| field | string | ✅ | ... |

**Response (201):**
```json
{ "success": true, "data": { ... } }
```

**Errors:**
- `400` — validation error
- `409` — conflict  
- `404` — not found
```

## Шаардлага
- Монгол + Англи хольж хэрэглэхийг зөвлөхгүй — нэгийг сонго
- Жишээ утга бодитой байх (placeholder биш)
- "obvious"-ийг тайлбарлахгүй, нарийн/чухал зүйлийг тайлбарла