import express from "express";
import { protect, restrictTo } from "../controllers/authController";
import * as NaturantController from "../controllers/naturantsController";
import reviewsRouter from "./reviewsRoutes"; // Import the reviewsRouter

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

router.use("/:naturantId/reviews", reviewsRouter); // Mount the reviewsRouter

router.get("/", getAllNaturants);
router.post("/", restrictTo("admin", "manager"), createNaturant);
router.get("/:id", parseNaturantId, getNaturantById);
router.put("/:id", parseNaturantId, updateNaturantById);
router.patch(
  "/:id",
  restrictTo("admin", "manager"),
  parseNaturantId,
  updateNaturantPartially
);
router.delete(
  "/:id",
  restrictTo("admin", "manager"),
  parseNaturantId,
  deleteNaturantById
);
router.get("/top", restrictTo("admin", "manager"), getTopNaturants);
router.get("/:id", parseNaturantId, getNaturantById);


export default router;
