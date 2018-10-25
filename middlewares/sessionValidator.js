
var express=require("express");
var router=express.Router();

 router.get("/",function(req,res,next){
    console.log("hey");
    if (req.session && req.session.user_id){
        console.log("session: " + req.session.user_id );
        next();
    } else {
        console.log ("sesion no establecida");
        res.redirect("login");
    }
});
module.exports =router;