import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';

const PORT = parseInt(process.env.PORT ?? '3000');
const app = createApp();

app.listen(PORT, () => {
    console.log(`Mini Library API running on http://localhost:${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/api-docs`);
});