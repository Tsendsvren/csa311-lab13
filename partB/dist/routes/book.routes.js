"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookRouter = createBookRouter;
const express_1 = require("express");
const BookRepository_1 = require("../repositories/BookRepository");
const LoanRepository_1 = require("../repositories/LoanRepository");
const database_1 = require("../db/database");
function createBookRouter(bookRepo, loanRepo) {
    const router = (0, express_1.Router)();
    const getBookRepo = () => bookRepo ?? new BookRepository_1.BookRepository((0, database_1.getDb)());
    const getLoanRepo = () => loanRepo ?? new LoanRepository_1.LoanRepository((0, database_1.getDb)());
    // GET /api/books
    router.get('/', (req, res) => {
        const search = req.query.search;
        const books = getBookRepo().findAll(search);
        const response = { success: true, data: books };
        res.json(response);
    });
    // GET /api/books/:id
    router.get('/:id', (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        const book = getBookRepo().findById(id);
        if (!book) {
            res.status(404).json({ success: false, error: 'Book not found' });
            return;
        }
        res.json({ success: true, data: book });
    });
    // POST /api/books
    router.post('/', (req, res) => {
        const { isbn, title, author, genre, published_year, total_copies } = req.body;
        if (!isbn || !title || !author) {
            res.status(400).json({ success: false, error: 'isbn, title, author are required' });
            return;
        }
        if (total_copies !== undefined && (isNaN(total_copies) || total_copies < 1)) {
            res.status(400).json({ success: false, error: 'total_copies must be >= 1' });
            return;
        }
        // Check duplicate ISBN
        const existing = getBookRepo().findByIsbn(isbn);
        if (existing) {
            res.status(409).json({ success: false, error: 'ISBN already exists' });
            return;
        }
        const book = getBookRepo().create({
            isbn,
            title,
            author,
            genre: genre ?? '',
            published_year: published_year ?? 0,
            total_copies: total_copies ?? 1,
        });
        res.status(201).json({ success: true, data: book });
    });
    // PUT /api/books/:id
    router.put('/:id', (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        const dto = req.body;
        const book = getBookRepo().update(id, dto);
        if (!book) {
            res.status(404).json({ success: false, error: 'Book not found' });
            return;
        }
        res.json({ success: true, data: book });
    });
    // DELETE /api/books/:id
    router.delete('/:id', (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        // Check active loans
        const activeLoans = getLoanRepo().findActiveByBook(id);
        if (activeLoans.length > 0) {
            res.status(409).json({ success: false, error: 'Cannot delete book with active loans' });
            return;
        }
        const deleted = getBookRepo().delete(id);
        if (!deleted) {
            res.status(404).json({ success: false, error: 'Book not found' });
            return;
        }
        res.json({ success: true, message: 'Book deleted' });
    });
    return router;
}
//# sourceMappingURL=book.routes.js.map