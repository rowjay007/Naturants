// routes/naturantsRoutes.ts

import express from "express";
import * as NaturantController from "../controllers/naturantsController";

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
  handleUndefinedRoutes,
} = NaturantController;

router.get("/", getAllNaturants);
router.post("/", createNaturant);
router.get("/:id", parseNaturantId, getNaturantById);
router.put("/:id", parseNaturantId, updateNaturantById);
router.patch("/:id", parseNaturantId, updateNaturantPartially);
router.delete("/:id", parseNaturantId, deleteNaturantById);

// Alias route for top naturants
router.get("/top", getTopNaturants);

// Handle undefined routes
router.use(handleUndefinedRoutes);

export default router;
