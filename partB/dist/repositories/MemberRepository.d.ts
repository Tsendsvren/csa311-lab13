import Database from 'better-sqlite3';
import { Member, CreateMemberDto, UpdateMemberDto } from '../models/index';
export declare class MemberRepository {
    private db;
    constructor(db: Database.Database);
    findAll(search?: string, status?: string): Member[];
    findById(id: number): Member | undefined;
    findByEmail(email: string): Member | undefined;
    create(dto: CreateMemberDto): Member;
    update(id: number, dto: UpdateMemberDto): Member | undefined;
    delete(id: number): boolean;
}
//# sourceMappingURL=MemberRepository.d.ts.map