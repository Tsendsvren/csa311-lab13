import Database from 'better-sqlite3';
import { Book, CreateBookDto, UpdateBookDto } from '../models/index';
export declare class BookRepository {
    private db;
    constructor(db: Database.Database);
    findAll(search?: string): Book[];
    findById(id: number): Book | undefined;
    findByIsbn(isbn: string): Book | undefined;
    create(dto: CreateBookDto): Book;
    update(id: number, dto: UpdateBookDto): Book | undefined;
    delete(id: number): boolean;
    decrementAvailable(id: number): void;
    incrementAvailable(id: number): void;
}
//# sourceMappingURL=BookRepository.d.ts.map