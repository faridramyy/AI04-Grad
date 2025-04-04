import express from "express";

import {
    getAllTherapySessions,
    getTherapySessionById,
    createTherapySession,
    updateTherapySession,
    deleteTherapySession,
} from "../controllers/therapySessionController.js";

const router = express.Router();

router.get("/", getAllTherapySessions);
router.get("/:id", getTherapySessionById);
router.post("/", createTherapySession);
router.put("/:id", updateTherapySession);
router.delete("/:id", deleteTherapySession);

export default router;