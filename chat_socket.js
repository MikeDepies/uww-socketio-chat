var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var assets = __dirname + '/assets';
var messages = [];
app.get('/', function(req, res){
  res.sendFile(assets + '/index_socket.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  console.info(`Client connected [id=${socket.id}]`);
  socket.emit("messages", messages);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    messages.push(msg);
    io.emit('chat message', msg);
  });
});

app.get('/messages', function(req, res) {
  res.send(messages)
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});