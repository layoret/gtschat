
var express=require("express");
var User=require("../models/user.schema");
var router=express.Router();

router.route("/usrManager").get(async (req,res)=>{
    try {
        let users=await User.find({});    
        res.render("usrManager",{docs: users});
    } catch (error) {
        console.log(error);
        res.send("error");
    }
    
}).post(async (req,res)=>{
    try {
        let st=await User.addUser(req.body.usuario,req.body.pwd,req.body.pwd2);
        let users=await User.find({});    
        if (st==User.OK)
            res.render("usrManager",{docs: users});
        else    
            res.render("usrManager",{docs: users});
    } catch(err){
        console.log(err);
        res.send("Error");
    }
});

router.route("/chat").get((req,res)=>{
    res.render("chat");
});
router.route("/chat/hello").get((req,res)=>{
    res.render("base");
});
router.get("/socket.io/socket.io.js",(req,res)=>{
    res.sendFile("../node_modules/socket.io/lib/index.js")
});

module.exports=router;