import Database from 'better-sqlite3';
import { Loan, CreateLoanDto } from '../models/index';
export declare class LoanRepository {
    private db;
    constructor(db: Database.Database);
    findAll(status?: string): Loan[];
    findById(id: number): Loan | undefined;
    findActiveByMember(memberId: number): Loan[];
    findActiveByBook(bookId: number): Loan[];
    create(dto: CreateLoanDto): Loan;
    returnLoan(id: number): Loan | undefined;
    markOverdue(): number;
    countByStatus(): Record<string, number>;
}
//# sourceMappingURL=LoanRepository.d.ts.map