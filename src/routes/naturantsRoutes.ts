import express from "express";
import {
  getAllNaturants,
  createNaturant,
  getNaturantById,
  updateNaturantById,
  deleteNaturantById,
  updateNaturantPartially,
  parseNaturantId, // Add this line to import the new middleware
} from "../controllers/naturantsController";

const router = express.Router();

router.get("/", getAllNaturants);
router.post("/", createNaturant);
router.get("/:id", parseNaturantId, getNaturantById); // Use the middleware here
router.put("/:id", parseNaturantId, updateNaturantById); // Use the middleware here
router.patch("/:id", parseNaturantId, updateNaturantPartially); // Use the middleware here
router.delete("/:id", parseNaturantId, deleteNaturantById); // Use the middleware here

export default router;
