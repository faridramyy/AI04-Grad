import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  signinUser,
  verifyToken,
} from "../controllers/userController.js";

const router = express.Router();

// 👇 All routes are prefixed with /api/users in index.js
router.post("/signin", authMiddleware("none"), signinUser);
router.post("/signup", authMiddleware("none"), createUser);
router.get('/verify_token',verifyToken)
router.post("/logout", logoutUser);


//admin functions
router.post("/create_user", authMiddleware("admin"), createUser); // Create new user
router.get("/", authMiddleware("admin"), getAllUsers); // Get all users
router.get("/:id", authMiddleware("logged"), getUserById); // Get user by ID
router.put("/:id", authMiddleware("logged"), updateUser); // Update user by ID
router.delete("/:id", authMiddleware("admin"), deleteUser); // Delete user by ID

export default router;
