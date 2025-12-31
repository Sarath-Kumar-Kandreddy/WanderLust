const User=require('../models/users');

module.exports.loginform=(req,res)=>{
    res.render('users/login.ejs');
};

module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wanderLust! you are logged in!");
 //    console.log(req.locals.redirectUrl);
 let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};

module.exports.signupform=(req,res)=>{
    res.render('users/signup.ejs');
};

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const user=new User({
        username,email

    })
    let registeredUser=await User.register(user,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","welcome to wanderLust! you are logged in!");
        res.redirect('/listings');
    })
    
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
        
    

};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash('success','you are loggged out!');
        res.redirect('/listings');

    })

};