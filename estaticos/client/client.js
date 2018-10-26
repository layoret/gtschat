

var socket=io();
socket.emit("message","hola");
socket.on("newMessage",function(msg){
    document.getElementById("message").value+= msg.mensaje + "\n";
});
//console.log ("AQUI EN CLIENT JS");
//console.log(socket.io.name);




