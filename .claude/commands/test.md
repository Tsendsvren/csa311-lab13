# /test — Test Generation (Testing Pyramid)

Энэ функц/модулийн тестийг testing pyramid зарчмаар үүсгэ.

## Testing Pyramid

### Unit Tests (хамгийн олон)
Repository болон utility функцийн тест:
- Happy path: зөв input → зөв output
- Edge cases:
  - Хоосон/null/undefined input
  - Хязгаарын утга (0, -1, INT_MAX)
  - Duplicate data
  - Non-existent ID

### Integration Tests (дунд)
HTTP endpoint-ийн supertest тест:
- Бүх HTTP method тус бүрд
- Validation error (400)
- Not found (404)
- Conflict (409)
- Амжилттай response (200/201)

### Edge Cases (заавал орох)
- Concurrent зээл: нэг номыг давхар зээлэх оролдлого
- Return хийсэн зээлийг дахин return хийх
- Идэвхгүй гишүүн зээлэх оролдлого
- available_copies тоо үнэн зөв шинэчлэгдэж байгаа эсэх

## Тест форматын шаардлага
```typescript
describe('FeatureName', () => {
  test('action — expected result', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Тест бичихдээ:
1. Тест бүр нэг зүйл л шалгах (Single Responsibility)
2. Тест нэр нь "юу хийхэд юу болох" гэдгийг тодорхой харуулах
3. `beforeEach`-д in-memory DB ашиглах (`createTestDb()`)
4. Тестүүд бие биенээсээ хамааралгүй байх