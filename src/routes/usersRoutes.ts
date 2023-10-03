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

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", parseUserId, getUserById);
router.put("/:id", parseUserId, updateUserById);
router.patch("/:id", parseUserId, updateUserPartially); 
router.delete("/:id", parseUserId, deleteUserById);

export default router;
