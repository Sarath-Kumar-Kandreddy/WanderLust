const review=require('../models/review.js');
const Listing=require('../models/listing.js');

module.exports.addReview=async(req,res)=>{
    
    const {id}=req.params;
    const listing=await Listing.findById(id); 
    const newReview=new review({
        rating:req.body.rating,
        comment:req.body.comment,
        createdAt:Date.now()
    });
    newReview.author=req.user._id;
    listing.reviews.push(newReview); 
    await newReview.save();
    await listing.save();
    req.flash("success","new review created");
    res.redirect(`/listings/${id}`);
  


};
module.exports.deleteReview=async(req,res)=>{
    const {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    //res.send("deleted");
    req.flash("success","review deleted");
   res.redirect(`/listings/${id}`);
};