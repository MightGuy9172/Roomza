const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviews.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

//POST Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview),
);

//DELETE Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview),
);

module.exports = router;
