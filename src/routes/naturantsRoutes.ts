import express from "express";
import {
  getAllNaturants,
  createNaturant,
  getNaturantById,
  updateNaturantById,
  deleteNaturantById,
  updateNaturantPartially,
  parseNaturantId,
} from "../controllers/naturantsController";

const router = express.Router();

router.get("/", getAllNaturants);
router.post("/", createNaturant);
router.get("/:id", parseNaturantId, getNaturantById); // Remove checkID middleware
router.put("/:id", parseNaturantId, updateNaturantById); // Remove checkID middleware
router.patch("/:id", parseNaturantId, updateNaturantPartially); // Remove checkID middleware
router.delete("/:id", parseNaturantId, deleteNaturantById); // Remove checkID middleware

export default router;
