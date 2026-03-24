import { app } from "./app";
import db from "./infra/mongo/connection";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start(): Promise<void> {
  await db.connect();
  app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
  });
}

start().catch((error) => {
  console.error("Falha ao iniciar a API:", error);
  process.exit(1);
});
