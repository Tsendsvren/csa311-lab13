import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../models/index';

export interface AppError extends Error {
    statusCode?: number;
}

export function errorHandler(
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    const statusCode = err.statusCode ?? 500;
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal server error'
        : err.message;

    const response: ApiResponse<never> = {
        success: false,
        error: message,
    };
    res.status(statusCode).json(response);
}

export function notFound(_req: Request, res: Response): void {
    res.status(404).json({ success: false, error: 'Route not found' });
}