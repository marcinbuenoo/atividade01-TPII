"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const connection_1 = __importDefault(require("./infra/mongo/connection"));
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
async function start() {
    await connection_1.default.connect();
    app_1.app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API rodando na porta ${port}`);
    });
}
start().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Falha ao iniciar a API:", error);
    process.exit(1);
});
