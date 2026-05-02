import { Router, Request, Response } from 'express';
import { LoanRepository } from '../repositories/LoanRepository';
import { BookRepository } from '../repositories/BookRepository';
import { MemberRepository } from '../repositories/MemberRepository';
import { getDb } from '../db/database';
import { CreateLoanDto } from '../models/index';

export function createLoanRouter(
    loanRepo?: LoanRepository,
    bookRepo?: BookRepository,
    memberRepo?: MemberRepository
): Router {
    const router = Router();
    const getLoanRepo = () => loanRepo ?? new LoanRepository(getDb());
    const getBookRepo = () => bookRepo ?? new BookRepository(getDb());
    const getMemberRepo = () => memberRepo ?? new MemberRepository(getDb());

    // GET /api/loans
    router.get('/', (req: Request, res: Response) => {
        const status = req.query.status as string | undefined;
        // Auto-mark overdue before returning list
        getLoanRepo().markOverdue();
        const loans = getLoanRepo().findAll(status);
        res.json({ success: true, data: loans });
    });

    // GET /api/loans/:id
    router.get('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        const loan = getLoanRepo().findById(id);
        if (!loan) {
            res.status(404).json({ success: false, error: 'Loan not found' });
            return;
        }
        res.json({ success: true, data: loan });
    });

    // POST /api/loans — Зээлэх
    router.post('/', (req: Request, res: Response) => {
        const { book_id, member_id, due_days } = req.body as CreateLoanDto;
        
        if (!book_id || !member_id) {
            res.status(400).json({ success: false, error: 'book_id and member_id are required' });
            return;
        }

        // Check book exists and available
        const book = getBookRepo().findById(book_id);
        if (!book) {
            res.status(404).json({ success: false, error: 'Book not found' });
            return;
        }
        if (book.available_copies < 1) {
            res.status(409).json({ success: false, error: 'No available copies' });
            return;
        }

        // Check member exists and active
        const member = getMemberRepo().findById(member_id);
        if (!member) {
            res.status(404).json({ success: false, error: 'Member not found' });
            return;
        }
        if (member.status !== 'active') {
            res.status(409).json({ success: false, error: 'Member is not active' });
            return;
        }

        // Create loan + decrement available
        const db = getDb();
        const createLoan = db.transaction(() => {
            const loan = getLoanRepo().create({ book_id, member_id, due_days });
            getBookRepo().decrementAvailable(book_id);
            return loan;
        });
        
        const loan = createLoan();
        res.status(201).json({ success: true, data: loan });
    });

    // PUT /api/loans/:id/return — Буцаах
    router.put('/:id/return', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        
        const existing = getLoanRepo().findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: 'Loan not found' });
            return;
        }
        if (existing.status === 'returned') {
            res.status(409).json({ success: false, error: 'Loan already returned' });
            return;
        }
        
        const db = getDb();
        const returnLoan = db.transaction(() => {
            const loan = getLoanRepo().returnLoan(id);
            getBookRepo().incrementAvailable(existing.book_id);
            return loan;
        });
        
        const loan = returnLoan();
        res.json({ success: true, data: loan });
    });

    return router;
}