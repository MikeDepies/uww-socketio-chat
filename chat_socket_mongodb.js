var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://root:example@localhost:27017',{ useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log(err);
    process.exit(1)
  } 
  console.log('connected to mongodb...');
  start(client.db('chatdb'));
});
// db.create('messages')


app.use(express.static('public'))
var assets = __dirname + '/assets';
var messages = [];
app.get('/', function(req, res){
  res.sendFile(assets + '/index_localstorage.html');
});

function start(db) {
  const collection = db.collection('messages');
  io.on('connection', function(socket){
    console.log('a user connected');
    console.info(`Client connected [id=${socket.id}]`);
    collection.find().toArray((err, messages) => {
      socket.emit("messages", messages);
    });
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
      collection.insertOne(msg);
      io.emit('chat message', msg);
    });
  });
  
  app.get('/messages', function(req, res) {
    res.send(messages)
  })
  
  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
}
