import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error("❌ MONGODB_URI is not defined. Check your .env or docker-compose env_file.");
  process.exit(1);
}

mongoose
  .connect(dbURI, {
    autoIndex: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

export const Db = mongoose.connection;
