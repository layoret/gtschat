var express=require("express");
var User=require("../models/user.schema");
var router=express.Router();


router.route("/login").get((req,res)=>{
    res.render("login");
}).post(async (req,res)=>{
    var st=await User.login(req.body.usuario, req.body.pwd);
    if (st.cod==User.OK){
 
        req.session.user_id=st.id;
        res.send("LOGIN EXITOSO");
    } else {
        res.send("LOGIN NO EXITOSO");
    }
});



module.exports = router;
