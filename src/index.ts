import { app } from "./app";
import { connectMongo } from "./infra/mongo/connection";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start(): Promise<void> {
  await connectMongo();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API rodando na porta ${port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Falha ao iniciar a API:", error);
  process.exit(1);
});
