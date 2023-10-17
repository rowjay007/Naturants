// routes/naturantsRoutes.ts

import express from "express";
import { restrictTo } from "../controllers/authController";
import * as NaturantController from "../controllers/naturantsController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

const {
  getAllNaturants,
  createNaturant,
  getNaturantById,
  updateNaturantById,
  deleteNaturantById,
  updateNaturantPartially,
  parseNaturantId,
  getTopNaturants,
} = NaturantController;

// Use the protect middleware to protect the routes
router.use(protect);

router.get("/", getAllNaturants);
router.post("/", createNaturant);
router.get("/:id", parseNaturantId, getNaturantById);
router.put("/:id", parseNaturantId, updateNaturantById);
router.patch("/:id", parseNaturantId, updateNaturantPartially);

// Use restrictTo middleware to allow delete only for certain roles
router.delete(
  "/:id",
  restrictTo("admin", "manager"),
  parseNaturantId,
  deleteNaturantById
);

// Alias route for top naturants
router.get("/top", getTopNaturants);

export default router;
