"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_js_1 = require("./app.js");
const PORT = parseInt(process.env.PORT ?? '3000');
const app = (0, app_js_1.createApp)();
app.listen(PORT, () => {
    console.log(`Mini Library API running on http://localhost:${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/api-docs`);
});
//# sourceMappingURL=index.js.map