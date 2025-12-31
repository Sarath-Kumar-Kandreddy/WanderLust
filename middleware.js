const Listing=require('./models/listing');
const Review=require('./models/review');
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect('/login');
    }
    next();
};
module.exports.isLoggedInReview=(req,res,next)=>{
    if(!req.isAuthenticated()){
        const{id}=req.params;
        req.session.redirectUrl=`/listings/${id}`;
        req.flash("error","You must be logged in");
        return res.redirect('/login');
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
        if(req.session.redirectUrl){
            res.locals.redirectUrl=req.session.redirectUrl;
           
        }
        next();

}
module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
  //  const listing=await Listing.findById(id);
    const listing=await Listing.findById(id);
     if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","permission to only owners of this post");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewOwner=async(req,res,next)=>{
    const {id,reviewId}=req.params;
  //  const listing=await Listing.findById(id);
    const review=await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}