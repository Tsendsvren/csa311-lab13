"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFound = notFound;
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal server error'
        : err.message;
    const response = {
        success: false,
        error: message,
    };
    res.status(statusCode).json(response);
}
function notFound(_req, res) {
    res.status(404).json({ success: false, error: 'Route not found' });
}
//# sourceMappingURL=errorHandler.js.map