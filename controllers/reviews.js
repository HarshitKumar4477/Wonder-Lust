const Review = require("../models/reviews");
const Listing = require("../models/listing");

module.exports.renderReviewForm = async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    req.flash("success", "Review added your listing");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyReview = async (req, res) => {
      let { id, reviewId } = req.params;
  
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review Deleted");
      res.redirect(`/listings/${id}`);
    };