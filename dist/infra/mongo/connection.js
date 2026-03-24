"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    static instance;
    dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/backlogBooks";
    // Construtor privado previne criação de novas instâncias fora da classe
    constructor() { }
    // Método público para obter a única instância da conexão
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    // Método para iniciar a conexão
    async connect() {
        try {
            // Verifica se existe conexão ativa
            if (mongoose_1.default.connection.readyState >= 1) {
                console.log("Conexão com MongoDB já estabelecida.");
                return;
            }
            await mongoose_1.default.connect(this.dbUrl);
            console.log("🚀 Conectado ao MongoDB com sucesso!");
        }
        catch (erro) {
            console.log("❌ Erro ao conectar ao MongoDB", erro);
            throw erro;
        }
    }
}
// Exporta uma única instância
const db = Database.getInstance();
exports.default = db;
