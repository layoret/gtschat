//@ts-ignore
//Contrib: Julian De La Rosa
//------------------------ orden de schema para usuarios --------
var mongoose = require('mongoose');
var db=require("../helpers/db.js");
var User=require("./user.schema");
var mailsSchema = new mongoose.Schema({
    mail: String,
    usuario: {type: db.Schema.Types.ObjectId, ref:"User"}
});
var Mail=db.model("Mails", mailsSchema);

var test=async ()=>{
    let u=await User.findOne({usuario:"alberich"});
    let m=new Mail({mail: "apujols@hotmail.com"});
    m.usuario=u;
    u.mails.push(m);
    try {
        await m.save();
        await u.save();
        console.log("mail grabado con exito");
    }catch (err){
        console.log ("Error al grabar mail " + err);
    }
}

var test2=async ()=>{
    let docs=await Mail.find({usuario:{_id:"5bbf7bcb16c01c9e2bc2403d"}})
    .exec();
    console.log(docs);
}

var test3=async()=>{
    let u=await User.findOne({usuario:"alberich"}).populate("mails").exec();
    console.log(u);
}

test2();