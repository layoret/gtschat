var express=require("express");
var router_app=require("./routes/control");
var router_sec_app=require("./routes/secRouter");
var sessVal=require("./middlewares/sessionValidator");
var session=require("express-session");
var RedisStore = require('connect-redis')(session);
var morgan = require('morgan');
var cors=require('cors');
var http=require("http");
var user=require("./models/user.schema");
var app = module.exports = express();
var _server = http.createServer(app);
//Verificar si el App no tiene ningun usuario creado/ Setup
user.noUser();
var userSessionManager=session({
    store: new RedisStore({url: "//localhost:6379"}),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:false
});
app.sessionManager=userSessionManager;
var realtime=require('./servers/realtime.socket')(_server,userSessionManager);
//verificar que Redis esta arriba
//console.log(_db)
app.set("view engine", "pug");
app.use(userSessionManager);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use("/miApp/sec",sessVal);
app.use("/miApp", router_app);
app.use("/miApp/sec", router_sec_app);
app.use("/miApp/static",express.static("./estaticos"));
//realtime(server,userSessionManager); // esto crea el WEBSOCKET

//server.listen(4000);
