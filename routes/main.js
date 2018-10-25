var express=require("express");
var router=express.Router();
//var sessSecure=require("../middlewares/sessionValidator");

router.get('/',(req,res,)=>{
   
    res.render('index',{layout:'default'});

})
module.exports = router;