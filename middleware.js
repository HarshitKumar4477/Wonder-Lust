const Listing = require("./models/listing");
const {listSchema,reviewSchema} = require("./joiSchema");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/reviews.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User is not logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing =await  Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit or update");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateList = (req, res, next) => {
    // console.log("Incoming Request Body:", JSON.stringify(req.body, null, 2)); // Pretty print the request body
 
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid request structure: Missing 'listing' object.");
    }
 
    const { error } = listSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
 };

 module.exports.validateReview = (req,res,next)=>{
    // when we use joi validation tool all if condition remove 
     let {error} = reviewSchema.validate(req.body);
     if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
     }else{
        next();
     }
  }

  module.exports.isAuthor= async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
  }