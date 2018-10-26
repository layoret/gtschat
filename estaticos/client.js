

var socket=io.connect("http://localhost:3000");
//socket.emit('message',{name:"pedro"});
socket.suscribe("chat");
socket.on("newMessage",function(msg){
    alert(msg);
});




