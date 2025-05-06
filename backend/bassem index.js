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
import cookieParser from "cookie-parser";

// // to run this backend u need : npm install express mongoose dotenv bcrypt jsonwebtoken cookie-parser cors
// // and create a .env file that has this in it JWT_SECRET=your_super_secret_key_here
// import admin from 'firebase-admin';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// const __filename = fileURLToPath(
//     import.meta.url);
// const __dirname = dirname(__filename);

// // load your service account JSON
// const serviceAccount = JSON.parse(
//     fs.readFileSync(join(__dirname, '/firebase/firebase_service_acc.json'), 'utf8')
// );

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://rina-users-inputs-default-rtdb.europe-west1.firebasedatabase.app"
// });

// // export the database reference
// export const rtdb = admin.database();


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // replace with your frontend URL
    credentials: true,
}));
app.use(cookieParser()); // to parse cookies from requests

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