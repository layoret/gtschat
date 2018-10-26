var express=require("express");
//var router_app=require("./routes/control");
var secRouter=require("./routes/secRouter");
var mainRouter=require("./routes/main");
var controlRouter=require("./routes/control");
var sessVal=require("./middlewares/sessionValidator");
var errorProxy = require("./middlewares/error.proxy");
var path = require('path');
var session=require("express-session");
var RedisStore = require('connect-redis')(session);
var morgan = require('morgan');
var cors=require('cors');
var http=require("http");
var logger=require('./helpers/logger');
var user=require("./models/user.schema");
var realtime=require('./servers/realtime.socket')(_server,userSessionManager);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var app = module.exports = express();
var _server = http.createServer(app);
var clientRedis=require("redis-client");
app.logger=logger;
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/'
}));
//Verificar si el App no tiene ningun usuario creado/ Setup
user.noUser();
var userSessionManager=session({
    store: new RedisStore({url: "//localhost:6379"}),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:false
});

//verificar que Redis esta arriba
//console.log(_db)
//-------------------------------------------------------
// view engine setup
app.set("view engine", "hbs");
app.sessionManager=userSessionManager;

app.use(express.static('estaticos'));
//Views path : Nuestra UI/UXta
app.set('views', path.join(__dirname, 'views'));
//Set el middleware para handlebars
app.set('logs_dir', path.join(__dirname, 'logs/'));
app.use(userSessionManager);
//Use cors
app.use(cors());
//Body payload parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(logger.combinedFormat2, { stream: logger.stream }));

app.use("/",mainRouter);
app.use("/private",secRouter);
app.use("/login",controlRouter);

//app.use("/miApp/static",express.static("./estaticos"));
///app.use("/miApp", router_app);
//app.use("/miApp/sec", router_sec_app);
//app.use("/",sessVal);
app.use(function(req, res, next) {

    var err = new Error('Not Found');
    err.status = 404;
    next(err);

});
/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(errorProxy);
}
// production error handler
// no stacktraces leaked to user
app.use(errorProxy);
process.on("uncaughtException", function(ex) {
    logger.error("Error", { meta: ex });
});
//app.get("/",sessVal);
//realtime(server,userSessionManager); // esto crea el WEBSOCKET

//server.listen(4000);
