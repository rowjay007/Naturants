// reviewsRoutes.ts

import express from "express";
import { protect, restrictTo } from "../controllers/authController";
import * as reviewController from "../controllers/reviewsController";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(protect, restrictTo("user", "admin"), reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(restrictTo("user", "admin"), reviewController.updateReview)
  .delete(restrictTo("admin"), reviewController.deleteReview);

export default router;
