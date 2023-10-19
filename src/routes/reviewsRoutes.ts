// reviewsRoutes.ts

import express from "express";
import { restrictTo } from "../controllers/authController";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewById,
  updateReview,
} from "../controllers/reviewsController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect); 

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user", "admin"), createReview);

router
  .route("/:id")
  .get(getReviewById)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("admin"), deleteReview);

export default router;
