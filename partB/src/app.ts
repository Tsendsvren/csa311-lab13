import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { createBookRouter } from './routes/book.routes.js';
import { createMemberRouter } from './routes/member.routes.js';
import { createLoanRouter } from './routes/loan.routes.js';
import { createDashboardRouter } from './routes/dashboard.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp(): express.Application {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Health check
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API routes
    app.use('/api/books', createBookRouter());
    app.use('/api/members', createMemberRouter());
    app.use('/api/loans', createLoanRouter());
    app.use('/api/dashboard', createDashboardRouter());

    // Serve static frontend
    app.use(express.static('public'));

    // 404 & error handlers
    app.use(notFound);
    app.use(errorHandler);

    return app;
}