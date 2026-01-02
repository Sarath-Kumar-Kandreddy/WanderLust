if(process.env.NODE_ENV!="production"){
    require("dotenv").config();

}

console.log(process.env.secret);

const express=require('express');
const app=express();
const Listing=require('./models/listing');
const User=require('./models/users');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const mongoose=require('mongoose');
const engine=require('ejs-mate');
app.engine('ejs',engine);
const {ListingSchema,reviewSchema}=require('./schema.js');
const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const review=require('./models/review');
const listings=require('./routes/listings');
const reviewsRoute=require('./routes/reviewRoute.js');
const userRouter=require('./routes/user.js');

app.use(express.json());
const path=require('path');
app.use(express.static(path.join(__dirname,'/public')));
const methodOverride=require('method-override');
//const { createDecipheriv } = require('crypto');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'));

const session=require("express-session");
const MongoStore = require("connect-mongo").default;
const flash=require('connect-flash');

const dbUrl=process.env.atlas_url;
const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.secret,
    },
    touchAfter: 24 * 3600 // time period in seconds
  });

store.on("error",(e)=>{
    console.log("session store error",e);
});
const sessionOptions={
    //store,
    secret:process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }

};



app.use(session(sessionOptions));
app.use(flash());
const url='mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected to db");
    
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}
const validateListing=(req,res,next)=>{
   
    let {error}=ListingSchema.validate(req.body);
    if(error){
         let errmsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};
const validateReview=(req,res,next)=>{
   
    let {error}=reviewSchema.validate(req.body);
    if(error){
         let errmsg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*app.get('/demouser',async(req,res)=>{
    let fakeUser=new User({
        email:"sarathkandreddi@gmail.com",
        username:"k.sarath kumar20"

    });
    let registeredUser=await User.register(fakeUser,"helloworld");
   // console.log(registeredUser);
    res.send(registeredUser);
})*/
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user||null;
  //  console.log("Middleware running! User:", req.user);
    
    next();
});
app.use('/listings',listings);

app.use('/listings/:id/reviews',reviewsRoute);
app.use('/',userRouter);

/*app.get('/testListing',async (req,res)=>{
    res.send("testing listing route");
    let sampleListing=new Listing({
        title:"Sample Listing",
        description:"This is a small near the beach",
        image:"",
        price:1200,
        location:"Goa",
        country:"India",
    });
    await sampleListing.save();
    console.log(sampleListing);

});
*/

app.get('/home',(req,res)=>{
    res.render('home.ejs');
});



app.use((req, res, next) => {
  const err = new Error("PageNotFound");
  err.status = 404;
  next(err);
});

// Error handler middleware
app.use((err, req, res, next) => {
   let{statusCode=500,message="someError"}=err;
 // res.status(statusCode).send(message);
 res.status(statusCode).render('error.ejs',{message});
});



/*app.use((err,req,res,next)=>{
    let{statusCode=500,message="someError"}=err;
    res.status(statusCode).send(message);
});*/
app.listen(8080,()=>{
    console.log("server started at port 8080");
});


