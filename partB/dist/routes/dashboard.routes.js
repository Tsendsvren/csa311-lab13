"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDashboardRouter = createDashboardRouter;
const express_1 = require("express");
const BookRepository_1 = require("../repositories/BookRepository");
const MemberRepository_1 = require("../repositories/MemberRepository");
const LoanRepository_1 = require("../repositories/LoanRepository");
const database_1 = require("../db/database");
function createDashboardRouter(bookRepo, memberRepo, loanRepo) {
    const router = (0, express_1.Router)();
    const getBookRepo = () => bookRepo ?? new BookRepository_1.BookRepository((0, database_1.getDb)());
    const getMemberRepo = () => memberRepo ?? new MemberRepository_1.MemberRepository((0, database_1.getDb)());
    const getLoanRepo = () => loanRepo ?? new LoanRepository_1.LoanRepository((0, database_1.getDb)());
    // GET /api/dashboard
    router.get('/', (_req, res) => {
        // Auto-mark overdue
        getLoanRepo().markOverdue();
        const books = getBookRepo().findAll();
        const allMembers = getMemberRepo().findAll();
        const activeMembers = getMemberRepo().findAll(undefined, 'active');
        const loanCounts = getLoanRepo().countByStatus();
        const totalCopies = books.reduce((sum, b) => sum + b.total_copies, 0);
        const availableCopies = books.reduce((sum, b) => sum + b.available_copies, 0);
        const stats = {
            total_books: books.length,
            total_copies: totalCopies,
            available_copies: availableCopies,
            total_members: allMembers.length,
            active_members: activeMembers.length,
            active_loans: loanCounts['active'] ?? 0,
            overdue_loans: loanCounts['overdue'] ?? 0,
        };
        res.json({ success: true, data: stats });
    });
    return router;
}
//# sourceMappingURL=dashboard.routes.js.map