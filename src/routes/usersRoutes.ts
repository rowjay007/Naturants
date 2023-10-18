// routes/usersRoutes.ts

import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  parseUserId,
} from "../controllers/usersController";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} from "../controllers/authController";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", parseUserId, getUserById);
router.put("/:id", parseUserId, updateUserById);
router.delete("/:id", parseUserId, deleteUserById);

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Protected route (requires authentication)
router.patch("/update-password", protect, updatePassword);

export default router;
