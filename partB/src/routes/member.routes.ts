// src/routes/member.routes.ts
import { Router, Request, Response } from 'express';
import { MemberRepository } from '../repositories/MemberRepository';
import { getDb } from '../db/database';
import { CreateMemberDto, UpdateMemberDto } from '../models/index';

export function createMemberRouter(memberRepo?: MemberRepository): Router {
    const router = Router();
    const getRepo = () => memberRepo ?? new MemberRepository(getDb());

    // GET /api/members
    router.get('/', (req: Request, res: Response) => {
        const search = req.query.search as string | undefined;
        const status = req.query.status as string | undefined;
        const members = getRepo().findAll(search, status);
        res.json({ success: true, data: members });
    });

    // GET /api/members/:id
    router.get('/:id', (req: Request, res: Response) => {
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
    router.post('/', (req: Request, res: Response) => {
        const { name, email, phone } = req.body as CreateMemberDto;
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
    router.put('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, error: 'Invalid ID' });
            return;
        }
        const dto = req.body as UpdateMemberDto;
        const member = getRepo().update(id, dto);
        if (!member) {
            res.status(404).json({ success: false, error: 'Member not found' });
            return;
        }
        res.json({ success: true, data: member });
    });

    // DELETE /api/members/:id
    router.delete('/:id', (req: Request, res: Response) => {
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