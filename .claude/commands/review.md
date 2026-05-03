# /review — Security & Robustness Review

Энэ файлд байгаа кодыг дараах шалгуураар нарийвчлан шалга:

## 1. Security (OWASP Top 10)
- [ ] SQL Injection: параметржуулсан query ашиглаж байна уу? (`?` placeholder)
- [ ] Input validation: бүх user input шалгаж байна уу? (type, length, format)
- [ ] Error leakage: stack trace production-д exposed болж байна уу?
- [ ] Path traversal: file path user input-аас хамаарч байна уу?
- [ ] NoSQL/Command injection: eval() эсвэл shell command ашиглаж байна уу?

## 2. Robustness
- [ ] Edge case: хоосон array, null, undefined, NaN шалгаж байна уу?
- [ ] Integer overflow: parseInt() үр дүнг баталгаажуулж байна уу?
- [ ] Database transaction: хамтын өөрчлөлт transaction-д байна уу?
- [ ] Race condition: concurrent request-д data inconsistency гарч болох уу?

## 3. API Design
- [ ] HTTP status code зөв байна уу? (400 vs 404 vs 409 vs 500)
- [ ] Response format нийцтэй байна уу? (`{ success, data?, error? }`)
- [ ] Idempotency: PUT/DELETE дахин дуудвал safe байна уу?

## Хариулах форм:
```
CRITICAL (заавал засах): ...
WARNING (засахыг зөвлөж байна): ...
INFO (анхааруулга): ...
PASS (асуудалгүй): ...
```