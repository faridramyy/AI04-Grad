import express from "express";
import {
    getAllSevereCases,
    getSevereCaseById,
    createSevereCase,
    updateSevereCase,
    deleteSevereCase,
} from "../controllers/severeCaseController.js";

const router = express.Router();

router.get("/", getAllSevereCases);
router.get("/:id", getSevereCaseById);
router.post("/", createSevereCase);
router.put("/:id", updateSevereCase);
router.delete("/:id", deleteSevereCase);

export default router;