import express from "express";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from "../controllers/authController";
import {
  createUser,
  deleteCurrentUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  parseUserId,
  updateCurrentUser,
  updateUserById,
} from "../controllers/usersController";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Protected route (requires authentication)
router.patch("/update-password", protect, updatePassword);

// Users routes
router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", parseUserId, getUserById);
router.put("/:id", parseUserId, updateUserById);
router.patch("/update-current-user", protect, updateCurrentUser);
router.delete("/delete-current-user", protect, deleteCurrentUser);
router.delete("/:id", parseUserId, deleteUserById);

export default router;
