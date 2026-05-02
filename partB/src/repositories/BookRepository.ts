import Database from 'better-sqlite3';
import { Book, CreateBookDto, UpdateBookDto } from '../models/index';

export class BookRepository {
    constructor(private db: Database.Database) {}

    findAll(search?: string): Book[] {
        if (search) {
            const q = `%${search}%`;
            return this.db.prepare(`
            SELECT id, isbn, title, author, genre, published_year,
                    total_copies, available_copies, created_at, updated_at
            FROM books
            WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?
            ORDER BY title
            `).all(q, q, q) as Book[];
        }
        return this.db.prepare(`
            SELECT id, isbn, title, author, genre, published_year,
                    total_copies, available_copies, created_at, updated_at
            FROM books ORDER BY title
        `).all() as Book[];
    }

    findById(id: number): Book | undefined {
        return this.db.prepare(`
            SELECT id, isbn, title, author, genre, published_year,
                total_copies, available_copies, created_at, updated_at
            FROM books WHERE id = ?
        `).get(id) as Book | undefined;
    }

    findByIsbn(isbn: string): Book | undefined {
        return this.db.prepare(`
            SELECT id, isbn, title, author, genre, published_year,
                total_copies, available_copies, created_at, updated_at
            FROM books WHERE isbn = ?
        `).get(isbn) as Book | undefined;
    }

    create(dto: CreateBookDto): Book {
        const result = this.db.prepare(`
            INSERT INTO books (isbn, title, author, genre, published_year, total_copies, available_copies)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            dto.isbn,
            dto.title,
            dto.author,
            dto.genre,
            dto.published_year,
            dto.total_copies,
            dto.total_copies
        );
        return this.findById(result.lastInsertRowid as number) as Book;
    }

    update(id: number, dto: UpdateBookDto): Book | undefined {
        const existing = this.findById(id);
        if (!existing) return undefined;

        // Recalculate available_copies if total_copies changes
        let newAvailable = existing.available_copies;
        if (dto.total_copies !== undefined) {
            const diff = dto.total_copies - existing.total_copies;
            newAvailable = Math.max(0, existing.available_copies + diff);
        }

        this.db.prepare(`
            UPDATE books
            SET isbn = ?, title = ?, author = ?, genre = ?,
                published_year = ?, total_copies = ?, available_copies = ?,
                updated_at = datetime('now')
            WHERE id = ?
        `).run(
            dto.isbn ?? existing.isbn,
            dto.title ?? existing.title,
            dto.author ?? existing.author,
            dto.genre ?? existing.genre,
            dto.published_year ?? existing.published_year,
            dto.total_copies ?? existing.total_copies,
            newAvailable,
            id
        );
        return this.findById(id);
    }

    delete(id: number): boolean {
        const result = this.db.prepare('DELETE FROM books WHERE id = ?').run(id);
        return result.changes > 0;
    }

    decrementAvailable(id: number): void {
        this.db.prepare(`
            UPDATE books SET available_copies = available_copies - 1 WHERE id = ?
        `).run(id);
    }

    incrementAvailable(id: number): void {
        this.db.prepare(`
            UPDATE books SET available_copies = available_copies + 1 WHERE id = ?
        `).run(id);
    }
}