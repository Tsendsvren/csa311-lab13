import { Router, Request, Response } from 'express';
import { BookRepository } from '../repositories/BookRepository';
import { MemberRepository } from '../repositories/MemberRepository';
import { LoanRepository } from '../repositories/LoanRepository';
import { getDb } from '../db/database';
import { DashboardStats } from '../models/index';

export function createDashboardRouter(
    bookRepo?: BookRepository,
    memberRepo?: MemberRepository,
    loanRepo?: LoanRepository
): Router {
    const router = Router();
    const getBookRepo = () => bookRepo ?? new BookRepository(getDb());
    const getMemberRepo = () => memberRepo ?? new MemberRepository(getDb());
    const getLoanRepo = () => loanRepo ?? new LoanRepository(getDb());

  // GET /api/dashboard
    router.get('/', (_req: Request, res: Response) => {
      // Auto-mark overdue
        getLoanRepo().markOverdue();
        
        const books = getBookRepo().findAll();
        const allMembers = getMemberRepo().findAll();
        const activeMembers = getMemberRepo().findAll(undefined, 'active');
        const loanCounts = getLoanRepo().countByStatus();
        
        const totalCopies = books.reduce((sum, b) => sum + b.total_copies, 0);
        const availableCopies = books.reduce((sum, b) => sum + b.available_copies, 0);
        
        const stats: DashboardStats = {
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