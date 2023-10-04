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
} = NaturantController;

router.get("/", getAllNaturants);
router.post("/", createNaturant);
router.get("/:id", parseNaturantId, getNaturantById);
router.put("/:id", parseNaturantId, updateNaturantById);
router.patch("/:id", parseNaturantId, updateNaturantPartially);
router.delete("/:id", parseNaturantId, deleteNaturantById);

// Alias route for top naturants
router.get("/top", getTopNaturants);

export default router;
