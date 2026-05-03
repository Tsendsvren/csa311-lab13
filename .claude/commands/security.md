# /security — OWASP Top 10 Security Audit

Энэ кодыг OWASP Top 10 (2021) шалгуураар аудит хий.

## OWASP Top 10 Шалгалт

### A01: Broken Access Control
- [ ] Route бүр зөвшөөрлийг шалгаж байна уу?
- [ ] ID enumeration боломжтой юу? (sequential ID exploit)
- [ ] Foreign key constraint хэрэгжүүлж байна уу?

### A02: Cryptographic Failures
- [ ] Нууц мэдээлэл (нууц үг, токен) plain text байна уу?
- [ ] Sensitive data response-д exposed болж байна уу?

### A03: Injection
- [ ] SQL: бүх query parameterized байна уу? (`?` placeholder)
- [ ] Command injection: `exec()`, `eval()` ашиглаж байна уу?
- [ ] JSON injection: user input шууд JSON болгож байна уу?

### A04: Insecure Design
- [ ] Rate limiting байна уу?
- [ ] Business logic bypass боломжтой юу? (жишээ нь: available check)

### A05: Security Misconfiguration
- [ ] Error response stack trace leak байна уу?
- [ ] CORS зөв тохируулсан уу?
- [ ] Debug mode production-д асаалттай юу?

### A06: Vulnerable Components
- [ ] `npm audit` ажиллуулсан уу?
- [ ] Dependencies шинэчлэгдсэн үү?

### A08: Software Integrity Failures
- [ ] `package-lock.json` commit хийсэн үү?

### A09: Logging Failures  
- [ ] Чухал үйлдэл (login, delete, loan) log хийгдэж байна уу?
- [ ] Log-д нууц мэдээлэл орж байна уу?

## Хариулах форм
```
CRITICAL: [CVE эсвэл OWASP ref] — [тодорхой асуудал] → [засвар]
WARNING: ...
PASS: [шалгасан зүйл]
```