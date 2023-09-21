import express from "express";
import {
  getAllNaturants,
  createNaturant,
  getNaturantById,
  updateNaturantById,
  deleteNaturantById,
  updateNaturantPartially,
} from "../controllers/naturantsController";

const router = express.Router();

router.get("/", getAllNaturants);
router.post("/", createNaturant);
router.get("/:id", getNaturantById);
router.put("/:id", updateNaturantById);
router.patch("/:id", updateNaturantPartially);
router.delete("/:id", deleteNaturantById);

export default router;
