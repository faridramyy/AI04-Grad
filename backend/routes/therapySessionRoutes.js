import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
    getAllTherapySessions,
    getTherapySessionById,
    createTherapySession,
    updateTherapySession,
    deleteTherapySession,
    selectSession,
    getAllSessionsOfUser,
    dashboardStressAnalysis,
    allSessionsStressAnalysis,
    dashboardFinalScoreAnalysis,
    allSessionsFinalScoreAnalysis,
    getSessionEmotionDistribution,
    getAllSessionsEmotionDistribution,
    getRecentChatHistory

} from "../controllers/therapySessionController.js";

const router = express.Router();

// POST /api/therapy/stress-score


router.get("/", authMiddleware("admin"), getAllTherapySessions);
router.get("/getMySessions", authMiddleware("logged"), getAllSessionsOfUser);
router.get("/select_session/:id", authMiddleware("logged"), selectSession);
router.post("/", authMiddleware("logged"), createTherapySession);
router.put("/:id", authMiddleware("logged"), updateTherapySession);
router.delete("/:id", authMiddleware("logged"), deleteTherapySession);
router.get("/:sessionId/stress-chart", dashboardStressAnalysis);
router.get("/stress-chart/all", allSessionsStressAnalysis);
router.get("/chat-history", getRecentChatHistory);
router.get("/:sessionId/final-score-chart", dashboardFinalScoreAnalysis);
router.get("/final-score-chart/all", allSessionsFinalScoreAnalysis);
router.get("/:sessionId/emotion-distribution", getSessionEmotionDistribution);
router.get("/emotion-distribution/all", getAllSessionsEmotionDistribution);
router.get("/:id", authMiddleware("logged"), getTherapySessionById);



export default router;