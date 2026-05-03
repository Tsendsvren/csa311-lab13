"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRepository = void 0;
class MemberRepository {
    constructor(db) {
        this.db = db;
    }
    findAll(search, status) {
        let query = `
            SELECT id, name, email, phone, status, created_at, updated_at
            FROM members WHERE 1=1
        `;
        const params = [];
        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        query += ' ORDER BY name';
        return this.db.prepare(query).all(...params);
    }
    findById(id) {
        return this.db.prepare(`
            SELECT id, name, email, phone, status, created_at, updated_at
            FROM members WHERE id = ?
        `).get(id);
    }
    findByEmail(email) {
        return this.db.prepare(`
            SELECT id, name, email, phone, status, created_at, updated_at
            FROM members WHERE email = ?
        `).get(email);
    }
    create(dto) {
        const result = this.db.prepare(`
            INSERT INTO members (name, email, phone) VALUES (?, ?, ?)
        `).run(dto.name, dto.email, dto.phone);
        return this.findById(result.lastInsertRowid);
    }
    update(id, dto) {
        const existing = this.findById(id);
        if (!existing)
            return undefined;
        this.db.prepare(`
            UPDATE members
            SET name = ?, email = ?, phone = ?, status = ?, updated_at = datetime('now')
            WHERE id = ?
        `).run(dto.name ?? existing.name, dto.email ?? existing.email, dto.phone ?? existing.phone, dto.status ?? existing.status, id);
        return this.findById(id);
    }
    delete(id) {
        const result = this.db.prepare('DELETE FROM members WHERE id = ?').run(id);
        return result.changes > 0;
    }
}
exports.MemberRepository = MemberRepository;
//# sourceMappingURL=MemberRepository.js.map