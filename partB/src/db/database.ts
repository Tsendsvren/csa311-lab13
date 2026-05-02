import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database;

export function getDb(): Database.Database {
    if (!db) {
        const dbPath = process.env.DB_PATH || './library.db';
        const resolvedPath = path.resolve(dbPath);
        db = new Database(resolvedPath);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        runMigrations(db);
    }
    return db;
}

export function closeDb(): void {
    if (db) {
        db.close();
        (db as any) = undefined;
    }
}

export function createTestDb(): Database.Database {
    const testDb = new Database(':memory:');
    testDb.pragma('foreign_keys = ON');
    runMigrations(testDb);
    return testDb;
}

function runMigrations(database: Database.Database): void {
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