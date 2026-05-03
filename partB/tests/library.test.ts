import request from 'supertest';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import Database from 'better-sqlite3';
import { createTestDb } from '../src/db/database';
import { BookRepository } from '../src/repositories/BookRepository';
import { MemberRepository } from '../src/repositories/MemberRepository';
import { LoanRepository } from '../src/repositories/LoanRepository';
import { createBookRouter } from '../src/routes/book.routes';
import { createMemberRouter } from '../src/routes/member.routes';
import { createLoanRouter } from '../src/routes/loan.routes';
import { createDashboardRouter } from '../src/routes/dashboard.routes';
import { errorHandler, notFound } from '../src/middleware/errorHandler';

let db: Database.Database;
let bookRepo: BookRepository;
let memberRepo: MemberRepository;
let loanRepo: LoanRepository;
let app: express.Application;

beforeEach(() => {
    db = createTestDb();
    bookRepo = new BookRepository(db);
    memberRepo = new MemberRepository(db);
    loanRepo = new LoanRepository(db);

    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/books', createBookRouter(bookRepo, loanRepo));
    app.use('/api/members', createMemberRouter(memberRepo));
    app.use('/api/loans', createLoanRouter(loanRepo, bookRepo, memberRepo));
    app.use('/api/dashboard', createDashboardRouter(bookRepo, memberRepo, loanRepo));
    app.use(notFound);
    app.use(errorHandler);
});

afterEach(() => {
    db.close();
});

// BOOK TESTS

describe('Books API', () => {
    test('GET /api/books — empty list', async () => {
        const res = await request(app).get('/api/books');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual([]);
    });

    test('POST /api/books — create book successfully', async () => {
        const res = await request(app).post('/api/books').send({
            isbn: '978-3-16-148410-0',
            title: 'The Art of Code',
            author: 'John Doe',
            genre: 'Programming',
            published_year: 2020,
            total_copies: 3,
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('The Art of Code');
        expect(res.body.data.available_copies).toBe(3);
    });

    test('POST /api/books — missing required fields returns 400', async () => {
        const res = await request(app).post('/api/books').send({ isbn: '123' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/books — duplicate ISBN returns 409', async () => {
        await request(app).post('/api/books').send({
            isbn: '978-0-000-00000-0',
            title: 'Book One',
            author: 'Author',
        });
        const res = await request(app).post('/api/books').send({
            isbn: '978-0-000-00000-0',
            title: 'Book Two',
            author: 'Author',
        });
        expect(res.status).toBe(409);
    });

    test('GET /api/books/:id — found', async () => {
        const created = await request(app).post('/api/books').send({
            isbn: '978-1-111-11111-1',
            title: 'Test Book',
            author: 'Tester',
        });
        const id = created.body.data.id;
        const res = await request(app).get(`/api/books/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    test('GET /api/books/:id — not found returns 404', async () => {
        const res = await request(app).get('/api/books/9999');
        expect(res.status).toBe(404);
    });

    test('PUT /api/books/:id — update title', async () => {
        const created = await request(app).post('/api/books').send({
            isbn: '978-2-222-22222-2',
            title: 'Old Title',
            author: 'Author',
        });
        const id = created.body.data.id;
        const res = await request(app).put(`/api/books/${id}`).send({ title: 'New Title' });
        expect(res.status).toBe(200);
        expect(res.body.data.title).toBe('New Title');
    });

    test('DELETE /api/books/:id — success', async () => {
        const created = await request(app).post('/api/books').send({
            isbn: '978-3-333-33333-3',
            title: 'Delete Me',
            author: 'Author',
        });
        const id = created.body.data.id;
        const res = await request(app).delete(`/api/books/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/books?search= — filter by title', async () => {
        await request(app).post('/api/books').send({ isbn: '001', title: 'TypeScript Handbook', author: 'A' });
        await request(app).post('/api/books').send({ isbn: '002', title: 'Python Basics', author: 'B' });
        const res = await request(app).get('/api/books?search=TypeScript');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].title).toBe('TypeScript Handbook');
    });
});

// MEMBER TESTS

describe('Members API', () => {
    test('GET /api/members — empty list', async () => {
        const res = await request(app).get('/api/members');
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
    });

    test('POST /api/members — create successfully', async () => {
        const res = await request(app).post('/api/members').send({
            name: 'Болд Баатар',
            email: 'bold@example.mn',
            phone: '99001122',
        });
        expect(res.status).toBe(201);
        expect(res.body.data.name).toBe('Болд Баатар');
        expect(res.body.data.status).toBe('active');
    });

    test('POST /api/members — invalid email returns 400', async () => {
        const res = await request(app).post('/api/members').send({
          name: 'Test',
          email: 'not-an-email',
        });
        expect(res.status).toBe(400);
    });

    test('POST /api/members — duplicate email returns 409', async () => {
        await request(app).post('/api/members').send({ name: 'A', email: 'dup@test.mn' });
        const res = await request(app).post('/api/members').send({ name: 'B', email: 'dup@test.mn' });
        expect(res.status).toBe(409);
    });

    test('PUT /api/members/:id — deactivate member', async () => {
        const created = await request(app).post('/api/members').send({
            name: 'Inactive User',
            email: 'inactive@test.mn',
        });
        const id = created.body.data.id;
        const res = await request(app).put(`/api/members/${id}`).send({ status: 'inactive' });
        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('inactive');
    });
});

// LOAN TESTS

describe('Loans API', () => {
    let bookId: number;
    let memberId: number;

    beforeEach(async () => {
        const bookRes = await request(app).post('/api/books').send({
            isbn: 'L-001',
            title: 'Loan Test Book',
            author: 'Author',
            total_copies: 2,
        });
        bookId = bookRes.body.data.id;

        const memberRes = await request(app).post('/api/members').send({
            name: 'Зээлдэгч',
            email: 'borrower@test.mn',
        });
        memberId = memberRes.body.data.id;
    });

    test('POST /api/loans — checkout successfully', async () => {
        const res = await request(app).post('/api/loans').send({ book_id: bookId, member_id: memberId });
        expect(res.status).toBe(201);
        expect(res.body.data.status).toBe('active');
    });

    test('POST /api/loans — decrements available_copies', async () => {
        await request(app).post('/api/loans').send({ book_id: bookId, member_id: memberId });
        const bookRes = await request(app).get(`/api/books/${bookId}`);
        expect(bookRes.body.data.available_copies).toBe(1);
    });

    test('POST /api/loans — no available copies returns 409', async () => {
      // Checkout both copies
        const m2 = await request(app).post('/api/members').send({ name: 'M2', email: 'm2@t.mn' });
        await request(app).post('/api/loans').send({ book_id: bookId, member_id: memberId });
        await request(app).post('/api/loans').send({ book_id: bookId, member_id: m2.body.data.id });
        // Third checkout should fail
        const m3 = await request(app).post('/api/members').send({ name: 'M3', email: 'm3@t.mn' });
        const res = await request(app).post('/api/loans').send({ book_id: bookId, member_id: m3.body.data.id });
        expect(res.status).toBe(409);
        expect(res.body.error).toContain('No available copies');
    });

    test('PUT /api/loans/:id/return — return successfully', async () => {
        const loan = await request(app).post('/api/loans').send({ book_id: bookId, member_id: memberId });
        const loanId = loan.body.data.id;
        const res = await request(app).put(`/api/loans/${loanId}/return`);
        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('returned');
    });

    test('PUT /api/loans/:id/return — increments available_copies', async () => {
        const loan = await request(app).post('/api/loans').send({ book_id: bookId, member_id: memberId });
        await request(app).put(`/api/loans/${loan.body.data.id}/return`);
        const bookRes = await request(app).get(`/api/books/${bookId}`);
        expect(bookRes.body.data.available_copies).toBe(2);
    });

    test('PUT /api/loans/:id/return — already returned returns 409', async () => {
        const loan = await request(app).post('/api/loans').send({ book_id: bookId, member_id: memberId });
        const loanId = loan.body.data.id;
        await request(app).put(`/api/loans/${loanId}/return`);
        const res = await request(app).put(`/api/loans/${loanId}/return`);
        expect(res.status).toBe(409);
    });

    test('POST /api/loans — inactive member returns 409', async () => {
        await request(app).put(`/api/members/${memberId}`).send({ status: 'inactive' });
        const res = await request(app).post('/api/loans').send({ book_id: bookId, member_id: memberId });
        expect(res.status).toBe(409);
        expect(res.body.error).toContain('not active');
    });
});

// ═══════════════════════════════════════════════
// DASHBOARD TEST
// ═══════════════════════════════════════════════

describe('Dashboard API', () => {
    test('GET /api/dashboard — returns correct stats', async () => {
        await request(app).post('/api/books').send({ isbn: 'D-001', title: 'Book', author: 'A', total_copies: 3 });
        await request(app).post('/api/members').send({ name: 'M', email: 'm@d.mn' });
        
        const res = await request(app).get('/api/dashboard');
        expect(res.status).toBe(200);
        expect(res.body.data.total_books).toBe(1);
        expect(res.body.data.total_copies).toBe(3);
        expect(res.body.data.total_members).toBe(1);
        expect(res.body.data.active_members).toBe(1);
    });
});