import express from "express";
import {
    getAllUserSettings,
    getUserSettingsById,
    createUserSettings,
    updateUserSettings,
    deleteUserSettings,
} from "../controllers/userSettingsController.js";

const router = express.Router();

router.get("/", getAllUserSettings);
router.get("/:id", getUserSettingsById);
router.post("/", createUserSettings);
router.put("/:id", updateUserSettings);
router.delete("/:id", deleteUserSettings);

export default router;