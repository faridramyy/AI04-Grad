import express from "express";
import {
    getAllAIMessages,
    getAIMessageById,
    createAIMessage,
    updateAIMessage,
    deleteAIMessage,
} from "../controllers/aiMessageController.js";

const router = express.Router();

router.get("/", getAllAIMessages);
router.get("/:id", getAIMessageById);
router.post("/", createAIMessage);
router.put("/:id", updateAIMessage);
router.delete("/:id", deleteAIMessage);

export default router;