"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const leads_1 = require("./routes/leads");
const lead_facade_1 = require("./application/lead-facade");
const path_1 = __importDefault(require("path"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
exports.app.use("/", leads_1.leadRoutes);
exports.app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
exports.app.use((err, _req, res, _next) => {
    if (err instanceof lead_facade_1.AppError) {
        res.status(err.status).json({ error: err.message });
        return;
    }
    res.status(500).json({ error: "Erro interno" });
});
