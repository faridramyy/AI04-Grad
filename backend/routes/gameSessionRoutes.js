import express from "express";
import {
  getAllGameSessions,
  getGameSessionById,
  createGameSession,
  updateGameSession,
  deleteGameSession,
  recordInitialStress,
  generateScenario,
} from "../controllers/gameSessionController.js";

const router = express.Router();

router.post("/generate", generateScenario);
router.get("/", getAllGameSessions);
router.post("/stress-score", recordInitialStress);
router.get("/:id", getGameSessionById);
router.post("/", createGameSession);
router.put("/:id", updateGameSession);
router.delete("/:id", deleteGameSession);

export default router;
