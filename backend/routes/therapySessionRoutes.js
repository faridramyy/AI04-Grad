import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
    getAllTherapySessions,
    getTherapySessionById,
    createTherapySession,
    updateTherapySession,
    deleteTherapySession,
} from "../controllers/therapySessionController.js";

const router = express.Router();

router.get("/", authMiddleware("admin"), getAllTherapySessions);
router.get("/:id", authMiddleware("logged"), getTherapySessionById);
router.post("/", authMiddleware("logged"), createTherapySession);
router.put("/:id", authMiddleware("logged"), updateTherapySession);
router.delete("/:id", authMiddleware("logged"), deleteTherapySession);

export default router;