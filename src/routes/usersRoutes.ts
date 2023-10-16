// routes/usersRoutes.ts

import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  parseUserId,
  updateUserPartially,
} from "../controllers/usersController";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", parseUserId, getUserById);
router.put("/:id", parseUserId, updateUserById);
router.patch("/:id", parseUserId, updateUserPartially);
router.delete("/:id", parseUserId, deleteUserById);

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
