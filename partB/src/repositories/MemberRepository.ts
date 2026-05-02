import Database from 'better-sqlite3';
import { Member, CreateMemberDto, UpdateMemberDto } from '../models/index';

export class MemberRepository {
    constructor(private db: Database.Database) {}

    findAll(search?: string, status?: string): Member[] {
        let query = `
            SELECT id, name, email, phone, status, created_at, updated_at
            FROM members WHERE 1=1
        `;
        const params: unknown[] = [];
        
        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        query += ' ORDER BY name';
        
        return this.db.prepare(query).all(...params) as Member[];
    }

    findById(id: number): Member | undefined {
        return this.db.prepare(`
            SELECT id, name, email, phone, status, created_at, updated_at
            FROM members WHERE id = ?
        `).get(id) as Member | undefined;
    }

    findByEmail(email: string): Member | undefined {
        return this.db.prepare(`
            SELECT id, name, email, phone, status, created_at, updated_at
            FROM members WHERE email = ?
        `).get(email) as Member | undefined;
    }

    create(dto: CreateMemberDto): Member {
        const result = this.db.prepare(`
            INSERT INTO members (name, email, phone) VALUES (?, ?, ?)
        `).run(dto.name, dto.email, dto.phone);
        return this.findById(result.lastInsertRowid as number) as Member;
    }

    update(id: number, dto: UpdateMemberDto): Member | undefined {
        const existing = this.findById(id);
        if (!existing) return undefined;

        this.db.prepare(`
            UPDATE members
            SET name = ?, email = ?, phone = ?, status = ?, updated_at = datetime('now')
            WHERE id = ?
        `).run(
        dto.name ?? existing.name,
        dto.email ?? existing.email,
        dto.phone ?? existing.phone,
        dto.status ?? existing.status,
        id
        );
        return this.findById(id);
    }

    delete(id: number): boolean {
        const result = this.db.prepare('DELETE FROM members WHERE id = ?').run(id);
        return result.changes > 0;
    }
}