import express from "express";
import TherapySession from "../models/therapy_session.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    createExtractedEmotion,
    getAllExtractedEmotions,
    getExtractedEmotionById,
    updateExtractedEmotion,
    deleteExtractedEmotion
} from "../controllers/extractedEmotionController.js";

const router = express.Router();

router.post("/", authMiddleware("logged"), createExtractedEmotion);
router.get("/", authMiddleware("admin"), getAllExtractedEmotions);
router.get("/:id", authMiddleware("logged"), getExtractedEmotionById);
router.put("/:id", authMiddleware("logged"), updateExtractedEmotion);
router.delete("/:id", authMiddleware("logged"), deleteExtractedEmotion);

export default router;