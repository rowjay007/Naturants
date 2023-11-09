import express from "express";
import {
  forgotPassword,
  login,
  logout,
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
  me,
  parseUserId,
  updateCurrentUser,
  updateUserById,
} from "../controllers/usersController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.patch("/update-password", protect, updatePassword);

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/me", protect, me);
router.get("/:id", parseUserId, getUserById);
router.put("/:id", parseUserId, updateUserById);
router.patch("/update-current-user", protect, updateCurrentUser);
router.delete("/delete-current-user", protect, deleteCurrentUser);
router.delete("/:id", parseUserId, deleteUserById);

export default router;
