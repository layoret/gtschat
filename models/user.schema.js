//@ts-ignore
//Contrib: Julian De La Rosa
//------------------------ orden de schema para usuarios --------
var mongoose = require('mongoose');
var db=require("../helpers/db.js");
var bcrypt=require("bcrypt");

const SALT_ROUND=10;
var Schema = mongoose.Schema;

var userSchema = new Schema({
    usuario:{type: String, 
        maxlength:20,
        minlength:4,
        required: "El nombre de usuario es requerido",
        unique:true},
    password:{
        type:String,
        minlength:20},
    mails: [{type:db.Schema.ObjectId, ref: "Mails"}]
});
var User=mongoose.model('User', userSchema);

//Errores
User.OK=0
User.ERR_PWD_NO_COINCIDEN=1;
User.ERR_DB=2;
User.ERR_PWD_CORTO=3;
User.ERR_USR_NO_VALIDO=4;
User.ERR_PWD_NO_VALIDO=5;
User.createDefault=async()=>{
    let password="deaf123456";
    let hash=await bcrypt.hash(password,SALT_ROUND);
    let defaultUser=new User({usuario:"admin",password:hash});
    try{
        await defaultUser.save(); //persiste
        console.log("registro creado en base");    
        return User.OK;
    }catch(err){
        console.log(err);
        return User.ERR_DB;
    }
}

User.addUser=async (user, pwd, pwd2)=>{
    if (pwd!=pwd2) return User.ERR_PWD_NO_COINCIDEN;
    if (pwd.length<8) return User.ERR_PWD_CORTO;
    let hash=await bcrypt.hash(pwd, SALT_ROUND);
    let newUser=new User({usuario:user, password:hash});
    try{
        await newUser.save(); //persiste
        console.log("registro creado en base");    
        return User.OK;
    }catch(err){
        console.log(err);
        return User.ERR_DB;
    }
}
User.noUser=async()=>{
    let u=await User.findOne();
    if(!u){
        User.createDefault();
    }
}
User.login=async (user,pwd)=>{
    try {
        let u=await User.findOne({usuario:user});
        if (!u) return User.ERR_USR_NO_VALIDO;
        let st=await bcrypt.compare(pwd,u.password);
        if (st)
            return {cod:User.OK, id:u._id};
        else    
            return {cod:User.ERR_PWD_NO_VALIDO, id:""};
    } catch (error) {
        console.log(err);
        return {cod:User.ERR_DB, id:""};
    }
    
}

module.exports = User
//--- end contrib