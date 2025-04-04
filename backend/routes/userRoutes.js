import express from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// 👇 All routes are prefixed with /api/users in index.js

router.post("/", createUser); // Create new user
router.get("/", getAllUsers); // Get all users
router.get("/:id", getUserById); // Get user by ID
router.put("/:id", updateUser); // Update user by ID
router.delete("/:id", deleteUser); // Delete user by ID

export default router;