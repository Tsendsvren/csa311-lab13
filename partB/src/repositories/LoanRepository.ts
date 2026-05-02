// src/repositories/LoanRepository.ts
import Database from 'better-sqlite3';
import { Loan, CreateLoanDto } from '../models/index';

export class LoanRepository {
    constructor(private db: Database.Database) {}

    findAll(status?: string): Loan[] {
        let query = `
            SELECT l.id, l.book_id, l.member_id, l.loan_date, l.due_date,
                    l.return_date, l.status, l.created_at,
                    b.title AS book_title, b.isbn AS book_isbn,
                    m.name AS member_name, m.email AS member_email
            FROM loans l
            JOIN books b ON b.id = l.book_id
            JOIN members m ON m.id = l.member_id
            WHERE 1=1
        `;
        const params: unknown[] = [];
        if (status) {
            query += ' AND l.status = ?';
            params.push(status);
        }
        query += ' ORDER BY l.created_at DESC';
        return this.db.prepare(query).all(...params) as Loan[];
    }

    findById(id: number): Loan | undefined {
        return this.db.prepare(`
            SELECT l.id, l.book_id, l.member_id, l.loan_date, l.due_date,
                    l.return_date, l.status, l.created_at,
                    b.title AS book_title, b.isbn AS book_isbn,
                    m.name AS member_name, m.email AS member_email
            FROM loans l
            JOIN books b ON b.id = l.book_id
            JOIN members m ON m.id = l.member_id
            WHERE l.id = ?
        `).get(id) as Loan | undefined;
    }

    findActiveByMember(memberId: number): Loan[] {
        return this.db.prepare(`
            SELECT id, book_id, member_id, loan_date, due_date, return_date, status, created_at
            FROM loans WHERE member_id = ? AND status = 'active'
        `).all(memberId) as Loan[];
    }

    findActiveByBook(bookId: number): Loan[] {
        return this.db.prepare(`
            SELECT id, book_id, member_id, loan_date, due_date, return_date, status, created_at
            FROM loans WHERE book_id = ? AND status = 'active'
        `).all(bookId) as Loan[];
    }

    create(dto: CreateLoanDto): Loan {
        const dueDays = dto.due_days ?? 14;
        const result = this.db.prepare(`
            INSERT INTO loans (book_id, member_id, loan_date, due_date)
            VALUES (?, ?, date('now'), date('now', '+' || ? || ' days'))
        `).run(dto.book_id, dto.member_id, dueDays);
        return this.findById(result.lastInsertRowid as number) as Loan;
    }

    returnLoan(id: number): Loan | undefined {
        this.db.prepare(`
            UPDATE loans
            SET return_date = date('now'), status = 'returned'
            WHERE id = ? AND status = 'active'
        `).run(id);
        return this.findById(id);
    }

    // Mark overdue loans (due_date < today, still active)
    markOverdue(): number {
        const result = this.db.prepare(`
            UPDATE loans SET status = 'overdue'
            WHERE status = 'active' AND due_date < date('now')
        `).run();
        return result.changes;
    }

    countByStatus(): Record<string, number> {
        const rows = this.db.prepare(`
            SELECT status, COUNT(*) as count FROM loans GROUP BY status
        `).all() as { status: string; count: number }[];

        const result: Record<string, number> = { active: 0, returned: 0, overdue: 0 };
        for (const row of rows) {
            result[row.status] = row.count;
        }
        return result;
    }
}