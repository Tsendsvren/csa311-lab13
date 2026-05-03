"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMemberRouter = createMemberRouter;
// src/routes/member.routes.ts
const express_1 = require("express");
const MemberRepository_1 = require("../repositories/MemberRepository");
const database_1 = require("../db/database");
function createMemberRouter(memberRepo) {
    const router = (0, express_1.Router)();
    const getRepo = () => memberRepo ?? new MemberRepository_1.MemberRepository((0, database_1.getDb)());
    // GET /api/members
    router.get('/', (req, res) => {
        const search = req.query.search;
        const status = req.query.status;
        const members = getRepo().findAll(search, status);
        res.json({ success: true, data: members });
    });
    // GET /api/members/:id
    router.get('/:id', (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        const member = getRepo().findById(id);
        if (!member) {
            res.status(404).json({ success: false, error: 'Member not found' });
            return;
        }
        res.json({ success: true, data: member });
    });
    // POST /api/members
    router.post('/', (req, res) => {
        const { name, email, phone } = req.body;
        if (!name || !email) {
            res.status(400).json({ success: false, error: 'name and email are required' });
            return;
        }
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ success: false, error: 'Invalid email format' });
            return;
        }
        // Duplicate check
        if (getRepo().findByEmail(email)) {
            res.status(409).json({ success: false, error: 'Email already registered' });
            return;
        }
        const member = getRepo().create({ name, email, phone: phone ?? '' });
        res.status(201).json({ success: true, data: member });
    });
    // PUT /api/members/:id
    router.put('/:id', (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        const dto = req.body;
        const member = getRepo().update(id, dto);
        if (!member) {
            res.status(404).json({ success: false, error: 'Member not found' });
            return;
        }
        res.json({ success: true, data: member });
    });
    // DELETE /api/members/:id
    router.delete('/:id', (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        const deleted = getRepo().delete(id);
        if (!deleted) {
            res.status(404).json({ success: false, error: 'Member not found' });
            return;
        }
        res.json({ success: true, message: 'Member deleted' });
    });
    return router;
}
//# sourceMappingURL=member.routes.js.map