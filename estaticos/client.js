

var socket=io.connect("http://localhost:3000");
socket.emit('my other event',{name:"pedro"});
socket.on("news",function(msg){
    console.log(msg);
})
console.log ("AQUI EN CLIENT JS");
console.log(socket.io.name);




