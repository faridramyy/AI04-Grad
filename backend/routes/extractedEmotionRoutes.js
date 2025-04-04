import express from "express";
import {
    createExtractedEmotion,
    getAllExtractedEmotions,
    getExtractedEmotionById,
    updateExtractedEmotion,
    deleteExtractedEmotion
} from "../controllers/extractedEmotionController.js";

const router = express.Router();

router.post("/", createExtractedEmotion);
router.get("/", getAllExtractedEmotions);
router.get("/:id", getExtractedEmotionById);
router.put("/:id", updateExtractedEmotion);
router.delete("/:id", deleteExtractedEmotion);

export default router;