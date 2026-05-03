"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoanRouter = createLoanRouter;
const express_1 = require("express");
const LoanRepository_1 = require("../repositories/LoanRepository");
const BookRepository_1 = require("../repositories/BookRepository");
const MemberRepository_1 = require("../repositories/MemberRepository");
const database_1 = require("../db/database");
function createLoanRouter(loanRepo, bookRepo, memberRepo) {
    const router = (0, express_1.Router)();
    const getLoanRepo = () => loanRepo ?? new LoanRepository_1.LoanRepository((0, database_1.getDb)());
    const getBookRepo = () => bookRepo ?? new BookRepository_1.BookRepository((0, database_1.getDb)());
    const getMemberRepo = () => memberRepo ?? new MemberRepository_1.MemberRepository((0, database_1.getDb)());
    // GET /api/loans
    router.get('/', (req, res) => {
        const status = req.query.status;
        // Auto-mark overdue before returning list
        getLoanRepo().markOverdue();
        const loans = getLoanRepo().findAll(status);
        res.json({ success: true, data: loans });
    });
    // GET /api/loans/:id
    router.get('/:id', (req, res) => {
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
    router.post('/', (req, res) => {
        const { book_id, member_id, due_days } = req.body;
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
        const db = (0, database_1.getDb)();
        const createLoan = db.transaction(() => {
            const loan = getLoanRepo().create({ book_id, member_id, due_days });
            getBookRepo().decrementAvailable(book_id);
            return loan;
        });
        const loan = createLoan();
        res.status(201).json({ success: true, data: loan });
    });
    // PUT /api/loans/:id/return — Буцаах
    router.put('/:id/return', (req, res) => {
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
        const db = (0, database_1.getDb)();
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
//# sourceMappingURL=loan.routes.js.map