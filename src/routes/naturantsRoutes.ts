import express from "express";
import * as NaturantController from "../controllers/naturantsController";
import reviewsRouter from "./reviewsRoutes"; // Import the reviewsRouter
import { protect, restrictTo } from "../controllers/authController";

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
