const express=require("express");
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const {ListingSchema,reviewSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing');
const review=require('../models/review');
const {isLoggedIn,isOwner}=require('../middleware.js');
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
/*const cloudConfig=require('../cloudConfig.js');
const upload=cloudConfig;*/


const listingController=require('../controllers/listing.js');



const validateListing=(req,res,next)=>{
   
    let {error}=ListingSchema.validate(req.body);
    if(error){
         let errmsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};


router.get('/',wrapAsync(listingController.listings));
router.get('/new',isLoggedIn,listingController.newform);
router.get('/search',wrapAsync(listingController.matchedListings));
router.post("/",isLoggedIn,validateListing,upload.single('image'),wrapAsync(listingController.addnew));
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.editform));
router.get('/:id',wrapAsync(listingController.show));
router.put('/:id',validateListing,isLoggedIn,isOwner,upload.single('image'),wrapAsync(listingController.edit));
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.delete));

module.exports=router;