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
router.get("/:id", parseNaturantId, getNaturantById);
router.put("/:id", parseNaturantId, updateNaturantById);
router.patch("/:id", parseNaturantId, updateNaturantPartially);
router.delete("/:id", parseNaturantId, deleteNaturantById);

export default router;
