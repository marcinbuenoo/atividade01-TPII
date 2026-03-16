import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGO_URL;
  if (!uri) {
    throw new Error("MONGO_URL nao configurada");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri);
  }
  await connectionPromise;
}
