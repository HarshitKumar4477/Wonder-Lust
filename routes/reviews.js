const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const { validateReview, isAuthor,isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//validate reviews

//post route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.renderReviewForm)
);

// Delete the reviews

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
