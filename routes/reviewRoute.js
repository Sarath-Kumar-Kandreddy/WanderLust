const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const {ListingSchema,reviewSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js');
const review=require('../models/review.js');
const {isLoggedInReview,isReviewOwner}=require('../middleware.js');

const reviewController=require('../controllers/review.js');


const validateReview=(req,res,next)=>{
   
    let {error}=reviewSchema.validate(req.body);
    if(error){
         let errmsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};
router.post('/',validateReview,isLoggedInReview,wrapAsync(reviewController.addReview));
router.delete('/:reviewId',isReviewOwner,wrapAsync(reviewController.deleteReview));
module.exports=router;