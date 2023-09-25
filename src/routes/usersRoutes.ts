import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserByIdPatch,
} from "../controllers/usersController";
import { checkBody, checkID } from "../middleware/middleware";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", checkBody, createUser); // Use the middleware here
router.get("/:id", checkID, getUserById); // Use the middleware here
router.put("/:id", checkID, updateUserById); // Use the middleware here
router.patch("/:id", checkID, updateUserByIdPatch); // Use the middleware here
router.delete("/:id", checkID, deleteUserById); // Use the middleware here

export default router;
