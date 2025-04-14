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
} from "../controllers/therapySessionController.js";

const router = express.Router();

router.get("/", authMiddleware("admin"), getAllTherapySessions);
router.get("/:id", authMiddleware("logged"), getTherapySessionById);
router.get("/select_session/:id", authMiddleware("logged"), selectSession);
router.get("/get_my_sessions", authMiddleware("logged"), getAllSessionsOfUser);
router.post("/", authMiddleware("logged"), createTherapySession);
router.put("/:id", authMiddleware("logged"), updateTherapySession);
router.delete("/:id", authMiddleware("logged"), deleteTherapySession);


export default router;