# ARCHITECTURE.md — Mini Library System

## Системийн архитектур

### Layer диаграм

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        UI[HTML/CSS/JS Frontend]
    end

    subgraph API["🚀 API Layer (Express + TypeScript)"]
        Router[Express Router]
        MW[Middleware<br/>logger · error handler · validator]
        BC[BookController]
        MC[MemberController]
        LC[LoanController]
        DC[DashboardController]
    end

    subgraph Repo["📦 Repository Layer"]
        BR[BookRepository]
        MR[MemberRepository]
        LR[LoanRepository]
    end

    subgraph DB["🗄️ Data Layer"]
        SQLite[(SQLite DB<br/>library.db)]
    end

    UI -->|HTTP REST JSON| Router
    Router --> MW
    MW --> BC
    MW --> MC
    MW --> LC
    MW --> DC
    BC --> BR
    MC --> MR
    LC --> LR
    LC --> BR
    LC --> MR
    DC --> BR
    DC --> MR
    DC --> LR
    BR --> SQLite
    MR --> SQLite
    LR --> SQLite
```

### Data Flow диаграм

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Router
    participant Ctrl as Controller
    participant Repo as Repository
    participant DB as SQLite

    C->>R: POST /api/loans {bookId, memberId}
    R->>Ctrl: loanController.create(req, res)
    Ctrl->>Ctrl: validate input
    Ctrl->>Repo: bookRepo.findById(bookId)
    Repo->>DB: SELECT id, available FROM books WHERE id=?
    DB-->>Repo: {id, available: true}
    Repo-->>Ctrl: Book found, available
    Ctrl->>Repo: loanRepo.create({bookId, memberId, dueDate})
    Repo->>DB: INSERT INTO loans ...
    DB-->>Repo: loan created
    Repo->>DB: UPDATE books SET available=false WHERE id=?
    DB-->>Repo: updated
    Repo-->>Ctrl: Loan object
    Ctrl-->>R: {success: true, data: loan}
    R-->>C: HTTP 201 JSON
```

### Entity Relationship диаграм

```mermaid
erDiagram
    BOOKS {
        integer id PK
        text isbn UK
        text title
        text author
        text genre
        integer published_year
        integer total_copies
        integer available_copies
        text created_at
        text updated_at
    }

    MEMBERS {
        integer id PK
        text name
        text email UK
        text phone
        text status
        text created_at
        text updated_at
    }

    LOANS {
        integer id PK
        integer book_id FK
        integer member_id FK
        text loan_date
        text due_date
        text return_date
        text status
        text created_at
    }

    BOOKS ||--o{ LOANS : "зээлэгддэг"
    MEMBERS ||--o{ LOANS : "зээлдэг"
```

## Module тодорхойлолт

### `src/routes/`
HTTP method + path-ийг controller функцтэй холбоно.
- `book.routes.ts` — `/api/books` CRUD endpoints
- `member.routes.ts` — `/api/members` CRUD endpoints
- `loan.routes.ts` — `/api/loans` зээл үүсгэх, буцаах
- `dashboard.routes.ts` — `/api/dashboard` статистик

### `src/controllers/`
HTTP request-ийг задлан авч, response буцаана. Business logic-ийн хяналт.
- Input validation
- Repository дуудах
- Зохих HTTP status + JSON response

### `src/repositories/`
Бүх SQL query энд. Controller-д SQL байхгүй.
- `BookRepository` — books CRUD + хайх
- `MemberRepository` — members CRUD + хайх
- `LoanRepository` — loans CRUD, буцаалт, хугацаа хяналт

### `src/models/`
TypeScript interface болон type тодорхойлолт.
- `Book`, `CreateBookDto`, `UpdateBookDto`
- `Member`, `CreateMemberDto`
- `Loan`, `CreateLoanDto`
- `ApiResponse<T>`

### `src/db/`
SQLite холболт болон schema migration.
- `database.ts` — DB connection singleton
- `migrations/001-initial.sql` — хүснэгтүүд үүсгэх

### `src/middleware/`
- `errorHandler.ts` — нэгдсэн error handling
- `requestLogger.ts` — HTTP request log
- `validate.ts` — input validation helper

## Folder бүтэц

```
bie-daalt-13/
├── CLAUDE.md
├── README.md
├── .gitignore
├── .claude/
│   └── commands/
│       ├── review.md
│       ├── test.md
│       ├── docs.md
│       ├── commit.md
│       └── security.md
├── partA/
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md
│   ├── STACK-COMPARISON.md
│   ├── README.md
│   ├── adr/0001-stack-decision.md
│   └── ai-sessions/plan.md
├── partB/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── db/
│   ├── tests/
│   └── ai-sessions/
└── partC/
    ├── AI-USAGE-REPORT.md
    ├── SELF-EVALUATION.md
    └── adr/0002-decision.md
```