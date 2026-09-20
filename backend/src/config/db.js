import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load backend/.env locally (on Vercel, env vars come from project settings)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Reuse one connection across requests / serverless invocations
let cached = globalThis._mongoose || (globalThis._mongoose = { conn: null, promise: null });

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    const msg = "MONGO_URI is missing. Set it in backend/.env (local) or in Vercel Environment Variables.";
    console.error(`❌ ${msg}`);
    throw new Error(msg);
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then((m) => {
        console.log(`✅ MongoDB connected: ${m.connection.host}`);
        return m;
      })
      .catch((error) => {
        cached.promise = null;
        console.error(`❌ MongoDB connection error: ${error.message}`);
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
