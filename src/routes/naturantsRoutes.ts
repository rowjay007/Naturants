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
import { checkID } from "../middleware/middleware";

const router = express.Router();

router.get("/", getAllNaturants);
router.post("/", createNaturant);
router.get("/:id", checkID, parseNaturantId, getNaturantById); // Use the middleware here
router.put("/:id", checkID, parseNaturantId, updateNaturantById); // Use the middleware here
router.patch("/:id", checkID, parseNaturantId, updateNaturantPartially); // Use the middleware here
router.delete("/:id", checkID, parseNaturantId, deleteNaturantById); // Use the middleware here

export default router;
