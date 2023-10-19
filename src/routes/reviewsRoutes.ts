// reviewsRoutes.ts

import express from "express";
import { protect, restrictTo } from "../controllers/authController";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewById,
  updateReview,
} from "../controllers/reviewsController";

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
