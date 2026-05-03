export interface Book {
    id: number;
    isbn: string;
    title: string;
    author: string;
    genre: string;
    published_year: number;
    total_copies: number;
    available_copies: number;
    created_at: string;
    updated_at: string;
}
export interface CreateBookDto {
    isbn: string;
    title: string;
    author: string;
    genre: string;
    published_year: number;
    total_copies: number;
}
export interface UpdateBookDto {
    isbn?: string;
    title?: string;
    author?: string;
    genre?: string;
    published_year?: number;
    total_copies?: number;
}
export interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}
export interface CreateMemberDto {
    name: string;
    email: string;
    phone: string;
}
export interface UpdateMemberDto {
    name?: string;
    email?: string;
    phone?: string;
    status?: 'active' | 'inactive';
}
export interface Loan {
    id: number;
    book_id: number;
    member_id: number;
    loan_date: string;
    due_date: string;
    return_date: string | null;
    status: 'active' | 'returned' | 'overdue';
    created_at: string;
    book_title?: string;
    book_isbn?: string;
    member_name?: string;
    member_email?: string;
}
export interface CreateLoanDto {
    book_id: number;
    member_id: number;
    due_days?: number;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface DashboardStats {
    total_books: number;
    total_copies: number;
    available_copies: number;
    total_members: number;
    active_members: number;
    active_loans: number;
    overdue_loans: number;
}
//# sourceMappingURL=index.d.ts.map