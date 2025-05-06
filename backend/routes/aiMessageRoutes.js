import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllAIMessages,
  getAIMessageById,
  createAIMessage,
  updateAIMessage,
  deleteAIMessage,
} from "../controllers/aiMessageController.js";

const router = express.Router();

router.get("/", authMiddleware("admin"), getAllAIMessages);
router.get("/:id", authMiddleware("logged"), getAIMessageById);
router.post("/", authMiddleware("logged"), createAIMessage);
router.put("/:id", authMiddleware("logged"), updateAIMessage);
router.delete("/:id", authMiddleware("logged"), deleteAIMessage);

export default router;
