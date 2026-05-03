"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.closeDb = closeDb;
exports.createTestDb = createTestDb;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
let db;
function getDb() {
    if (!db) {
        const dbPath = process.env.DB_PATH || './library.db';
        const resolvedPath = path_1.default.resolve(dbPath);
        db = new better_sqlite3_1.default(resolvedPath);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        runMigrations(db);
    }
    return db;
}
function closeDb() {
    if (db) {
        db.close();
        db = undefined;
    }
}
function createTestDb() {
    const testDb = new better_sqlite3_1.default(':memory:');
    testDb.pragma('foreign_keys = ON');
    runMigrations(testDb);
    return testDb;
}
function runMigrations(database) {
    database.exec(`
        CREATE TABLE IF NOT EXISTS books (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            isbn            TEXT    NOT NULL UNIQUE,
            title           TEXT    NOT NULL,
            author          TEXT    NOT NULL,
            genre           TEXT    NOT NULL DEFAULT '',
            published_year  INTEGER NOT NULL DEFAULT 0,
            total_copies    INTEGER NOT NULL DEFAULT 1,
            available_copies INTEGER NOT NULL DEFAULT 1,
            created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS members (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            email       TEXT    NOT NULL UNIQUE,
            phone       TEXT    NOT NULL DEFAULT '',
            status      TEXT    NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active', 'inactive')),
            created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS loans (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id     INTEGER NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
            member_id   INTEGER NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
            loan_date   TEXT    NOT NULL DEFAULT (date('now')),
            due_date    TEXT    NOT NULL,
            return_date TEXT    DEFAULT NULL,
            status      TEXT    NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active', 'returned', 'overdue')),
            created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_loans_book_id   ON loans(book_id);
        CREATE INDEX IF NOT EXISTS idx_loans_member_id ON loans(member_id);
        CREATE INDEX IF NOT EXISTS idx_loans_status    ON loans(status);
        CREATE INDEX IF NOT EXISTS idx_books_isbn      ON books(isbn);
        CREATE INDEX IF NOT EXISTS idx_members_email   ON members(email);
    `);
}
//# sourceMappingURL=database.js.map