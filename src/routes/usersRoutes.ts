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
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getAllUsers); // Secure this route with authentication
router.post("/", createUser);
router.get("/:id", parseUserId, protect, getUserById); // Secure this route with authentication
router.put("/:id", parseUserId, protect, updateUserById); // Secure this route with authentication
router.patch("/:id", parseUserId, protect, updateUserPartially); // Secure this route with authentication
router.delete("/:id", parseUserId, protect, deleteUserById); // Secure this route with authentication

export default router;
