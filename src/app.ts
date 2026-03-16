import express, { Request, Response, NextFunction } from "express";
import { leadRoutes } from "./routes/leads";
import { AppError } from "./application/lead-facade";
import path from "path";

export const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/", leadRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: "Erro interno" });
});
