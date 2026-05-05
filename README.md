# Бие Даалт 13 - Mini Library System

**F.CSM311 Программ хангамжийн бүтээлт**  
AI-Assisted Software Construction

## Хурдан эхлэх

```bash
cd partB
npm install
npm run dev
# -> http://localhost:3000
```

## Тест ажиллуулах

```bash
cd partB
npm test
```

## Бүтэц

```
bie-daalt-13/
├── CLAUDE.md              # Build commands, conventions, no-go zones
├── .claude/commands/      # Custom slash commands (6 ширхэг)
├── partA/                 # А хэсэг: Төлөвлөлт
├── partB/                 # Б хэсэг: Хэрэгжилт (Express + TypeScript + SQLite)
└── partC/                 # В хэсэг: Эргэцүүлэл
```

## Stack

- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite (better-sqlite3)
- **Testing:** Jest + supertest (≥20 тест)
- **AI Tool:** Claude (Anthropic)

## Pass/Fail шалгуур хэрэгжилт

| Шаардлага | Статус |
|-----------|--------|
| А хэсгийн бүх файл | ✅ |
| CLAUDE.md (build, conventions, no-go) | ✅ |
| ARCHITECTURE.md (Mermaid) | ✅ |
| STACK-COMPARISON.md (3 stack) | ✅ |
| ADR-001 | ✅ |
| 3+ feature ажиллаж байна | ✅ |
| ≥4 custom slash commands | ✅ (6 ширхэг) |
| ≥10 unit test | ✅ (20+ тест) |
| AI session log ≥3 файл | ✅ |
| AI Usage Report ≥1500 үг | ✅ |
| ADR-002 | ✅ |
| SELF-EVALUATION.md | ✅ |
