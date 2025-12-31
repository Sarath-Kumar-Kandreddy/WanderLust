const Listing=require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.listings=async (req,res)=>{
    const listings=await Listing.find({});
    res.render('listings/listings.ejs',{listings});
};
module.exports.matchedListings=async (req,res)=>{
    let {search}=req.query;
    const listings=await Listing.find({$or: [
     {title: { $regex: search, $options: "i" } },  
     {description: { $regex: search, $options: "i" } },
    { location: { $regex: search, $options: "i" } },
    { country: { $regex: search, $options: "i" } }
  ]});
    res.render('listings/listings.ejs',{listings});
};

module.exports.show=async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate({path:'reviews',
        populate:{
            path:'author'
        },
    }).populate('owner');
    if(!listing){
        req.flash("error","page not available that u are trying to look");
        res.redirect('/listings');
    }
    else{
       // console.log(listing);
         res.render('listings/show.ejs',{listing});
    }
   
};
module.exports.newform=(req,res)=>{
    
        res.render('listings/new.ejs');
    
}
module.exports.addnew=async(req,res,next)=>{
  let response= await geocodingClient.forwardGeocode({
  query: req.body.location,
  limit: 10
})
  .send()
    let url=req.file.path;
    let filename=req.file.filename;
    let {title,description,image,price,location,country}=req.body;
   // console.log(req.body);
    let newListing1=new Listing({
        title,
        description,
        image,
        price,  
        location,
        country,
    });
    newListing1.owner=req.user._id;
    newListing1.image={url,filename};
    console.log(response.body.features);
    newListing1.geometry=response.body.features[0].geometry;
    let savedListing=await newListing1.save();
   // console.log(savedListing);
    req.flash("success","new listing created");
    res.redirect('/listings');
};
module.exports.editform=async(req,res)=>{
  //  res.render('listings/edit.ejs');
   const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","page not available that u are trying to update");
        res.redirect("/listings");
    }
    else{
        let originalImage=listing.image.url;
        originalImage=originalImage.replace('/upload','/upload/w_250');
        res.render('listings/edit.ejs',{listing,originalImage});
     
      
    }
        
};
module.exports.edit=async(req,res)=>{
     const {id}=req.params;
  //  const listing=await Listing.findById(id);
  //  console.log(listing);
    
    let {title,description,image,price,location,country}=req.body;
    
  
    let listing=await Listing.findByIdAndUpdate(id,{title,description,image,price,location,country});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);

    
};
module.exports.delete=async(req,res)=>{
    const {id}=req.params;
   // const listing=await Listing.findById(id);
  
         const list=await Listing.findByIdAndDelete(id);
    console.log(list);
    req.flash("success","listing deleted");
    res.redirect('/listings');

   
};