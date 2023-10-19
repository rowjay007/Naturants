// reviewsRoutes.ts

import { Router } from "express";
import * as ReviewsController from "../controllers/reviewsController"; // Import named exports
import { protect, restrictTo } from "../controllers/authController";

const router = Router();

router
  .route("/")
  .get(ReviewsController.getAllReviews)
  .post(protect, restrictTo("user", "admin"), ReviewsController.createReview);

router
  .route("/:id")
  .get(ReviewsController.getReviewById)
  .patch(protect, restrictTo("user", "admin"), ReviewsController.updateReview)
  .delete(protect, restrictTo("admin"), ReviewsController.deleteReview);

export default router;
