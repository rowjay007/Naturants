import express, { Request, Response } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserByIdPatch,
} from "../controllers/usersController";

// Create a custom interface that extends express.Request
interface CustomRequest extends Request {
  userId?: number;
}

const router = express.Router();

// Param middleware to parse the 'id' parameter
router.param("id", (req: CustomRequest, res: Response, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID parameter" });
  }
  req.userId = id; // Store the parsed ID in the request object
  next();
});

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.patch("/:id", updateUserByIdPatch);
router.delete("/:id", deleteUserById);

export default router;
