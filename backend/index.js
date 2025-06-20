import express from "express";
import cors from "cors";
import secrets from "./config/secrets.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

//routes
import userRoutes from "./routes/userRoutes.js";
import therapySessionRoutes from "./routes/therapySessionRoutes.js";
import extractedEmotionRoutes from "./routes/extractedEmotionRoutes.js";
import gameSessionRoutes from "./routes/gameSessionRoutes.js";
import userFeedbackRoutes from "./routes/userFeedbackRoutes.js";
import userSettingsRoutes from "./routes/userSettingsRoutes.js";
import aiMessageRoutes from "./routes/aiMessageRoutes.js";
import severeCaseRoutes from "./routes/severeCaseRoutes.js";
import stressScenarioRoutes from "./routes/stressScenarioRoutes.js";
import therapyReplyRoutes from "./routes/therapyReplyRoutes.js";
// import musicRoutes from "./routes/music.js";  

const port = secrets.PORT;
const app = express();

app.use((req, res, next) => {
  if (["POST","PUT","PATCH"].includes(req.method)) {
    return express.json()(req, res, next);
  }
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: secrets.FRONTEND_URL, // ✅ Allow requests from the frontend
    credentials: true,               // ✅ Allow credentials (cookies)
  })
);

app.use("/api/users", userRoutes);
app.use("/api/therapy-sessions", therapySessionRoutes);
app.use("/api/extracted-emotions", extractedEmotionRoutes);
app.use("/api/game-sessions", gameSessionRoutes);
app.use("/api/user-feedback", userFeedbackRoutes);
app.use("/api/user-settings", userSettingsRoutes);
app.use("/api/ai-messages", aiMessageRoutes);
app.use("/api/severe-cases", severeCaseRoutes);
app.use("/api/stress-scenarios", stressScenarioRoutes);
// app.use("/api/music", musicRoutes);  // Add this line to include the music route

app.use("/api/therapy-reply", therapyReplyRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});