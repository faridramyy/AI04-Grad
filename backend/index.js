import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/userRoutes.js";
import mongoose from "mongoose";
import therapySessionRoutes from "./routes/therapySessionRoutes.js";
import extractedEmotionRoutes from "./routes/extractedEmotionRoutes.js";
import gameSessionRoutes from "./routes/gameSessionRoutes.js";
import userFeedbackRoutes from "./routes/userFeedbackRoutes.js";
import userSettingsRoutes from "./routes/userSettingsRoutes.js";
import aiMessageRoutes from "./routes/aiMessageRoutes.js";
import severeCaseRoutes from "./routes/severeCaseRoutes.js";
import stressScenarioRoutes from "./routes/stressScenarioRoutes.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/chat", chatRoutes);
// backend and database crud operations
app.use("/api/users", userRoutes);
app.use("/api/therapy-sessions", therapySessionRoutes);
app.use("/api/extracted-emotions", extractedEmotionRoutes);
app.use("/api/game-sessions", gameSessionRoutes);
app.use("/api/user-feedback", userFeedbackRoutes);
app.use("/api/user-settings", userSettingsRoutes);
app.use("/api/ai-messages", aiMessageRoutes);
app.use("/api/severe-cases", severeCaseRoutes);
app.use("/api/stress-scenarios", stressScenarioRoutes);
// database and server connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb+srv://Rina:25102002b@rina.gp6gt.mongodb.net/rina_dataset";

// Function to connect to MongoDB
const connectDB = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // Stop the app if DB fails
    }
};

// Start server only after DB connects
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});