var express=require("express");
var router=express.Router();
//var sessSecure=require("../middlewares/sessionValidator");

router.get('/',(req,res,)=>{
   
    res.render('index',{layout:'default'});

}).get('/chat',(req,res)=>{
    res.redirect("/private/chat");
});
module.exports = router;