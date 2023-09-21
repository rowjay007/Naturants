import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserByIdPatch,
} from "../controllers/usersController";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.patch("/:id", updateUserByIdPatch);
router.delete("/:id", deleteUserById);

export default router;
