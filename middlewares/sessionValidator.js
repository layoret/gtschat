module.exports = function(req,res,next){
    if (req.session && req.session.user_id){
        console.log("session: " + req.session.user_id );
        next();
    } else {
        console.log ("sesion no establecida");
        res.redirect("/miApp/login");
    }
}