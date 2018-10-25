module.exports = function (server, session){
    var io=require("socket.io")(server);
    
   io.use(function(socket,next){
        console.log("oyendo");
        session(socket.request ,socket.request.res ,next);
    });

    io.on('connection', function (socket) {
        console.log('connected ' + socket.request.session.user_id);
        socket.emit('news', { hello: socket.request.session.id });
        socket.on('my other event', function (data) {
          console.log(data);
        });
      });
    console.log("WEB SOCKET INICIALIZADO");
}   