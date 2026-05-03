"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const book_routes_js_1 = require("./routes/book.routes.js");
const member_routes_js_1 = require("./routes/member.routes.js");
const loan_routes_js_1 = require("./routes/loan.routes.js");
const dashboard_routes_js_1 = require("./routes/dashboard.routes.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Health check
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // API routes
    app.use('/api/books', (0, book_routes_js_1.createBookRouter)());
    app.use('/api/members', (0, member_routes_js_1.createMemberRouter)());
    app.use('/api/loans', (0, loan_routes_js_1.createLoanRouter)());
    app.use('/api/dashboard', (0, dashboard_routes_js_1.createDashboardRouter)());
    // Serve static frontend
    app.use(express_1.default.static('public'));
    // 404 & error handlers
    app.use(errorHandler_js_1.notFound);
    app.use(errorHandler_js_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map