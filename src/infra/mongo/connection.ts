import mongoose from "mongoose";

class Database {
  private static instance: Database;
  private dbUrl: string =
    process.env.MONGO_URI || "mongodb://localhost:27017/garageflow";

  // Construtor privado previne criação de novas instâncias fora da classe
  private constructor() {}

  // Método público para obter a única instância da conexão
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Método para iniciar a conexão
  public async connect(): Promise<void> {
    try {
      // Verifica se existe conexão ativa
      if (mongoose.connection.readyState >= 1) {
        console.log("Conexão com MongoDB já estabelecida.");
        return;
      }

      await mongoose.connect(this.dbUrl);
      console.log("🚀 Conectado ao MongoDB com sucesso!");
    } catch (erro) {
      console.log("❌ Erro ao conectar ao MongoDB", erro);
      throw erro;
    }
  }
}

// Exporta uma única instância
const db = Database.getInstance();
export default db;
