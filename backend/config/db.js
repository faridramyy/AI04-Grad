import mongoose from "mongoose";
import secrets from "./secrets.js";

export default async () => {
  try {
    await mongoose.connect(secrets.MONGO_DB_URL);
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Stop the app if DB fails
  }
};
