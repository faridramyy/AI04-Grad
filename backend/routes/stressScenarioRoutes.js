import express from "express";
import {
    getAllScenarios,
    getScenarioById,
    createScenario,
    updateScenario,
    deleteScenario,
} from "../controllers/stressScenarioController.js";

const router = express.Router();

router.get("/", getAllScenarios);
router.get("/:id", getScenarioById);
router.post("/", createScenario);
router.put("/:id", updateScenario);
router.delete("/:id", deleteScenario);

export default router;