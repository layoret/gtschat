var express=require("express");
var User=require("../models/user.schema");
var router=express.Router();
var sessSecure=require("../middlewares/sessionValidator");

router.route("/").get((req,res)=>{
    res.render("login",{layout:'login'});
}).post(async (req,res)=>{
    var st=await User.login(req.body.usuario, req.body.pwd);
    if (st.cod==User.OK){
 
        req.session.user_id=st.id;
        //res.send("LOGIN EXITOSO");
        res.redirect("/private/usrManager");
    } else {
        var loginError="Error de login";
        res.render("login",{layout:'login',loginError:loginError});
    }
});
router.route("/logout").get((req,res)=>{
    req.session.user_id=null;
    res.redirect("/login");
});


module.exports = router;
