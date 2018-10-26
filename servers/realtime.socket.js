
module.exports = function (server, session){
  var chatserver=require("socket.io")(server);
  var redis=require('redis');
  var client=redis.createClient();
  client.subscribe("chat");
   chatserver.use(function(socket,next){
        console.log("Websocket inicializado");
        session(socket.request ,socket.request.res ,next);
    });
    client.on("message",(channel,message)=>{
      //console.log("Websocket:"+channel+" "+message);
      //client.publish("chat","onNewMessage");
      chatserver.emit("newMessage",{mensaje:message});
    });
    chatserver.on('connection', function (socket) {
        console.log('connected ' + socket.request.session.user_id);
        socket.emit("newMessage",{mensaje:"Bienvenido"});
        
      });
      
    console.log("WEB SOCKET INICIALIZADO");
}   