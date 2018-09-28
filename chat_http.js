var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var io = require('socket.io')(http);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var assets = __dirname + '/assets';
var messages = [];
app.get('/', function(req, res){
  res.sendFile(assets + '/index.html');
});

app.get('/messages', function(req, res) {
  res.send(messages)
})

app.post('/message', function(req, res) {
  console.log(req.body)
  messages.push(req.body)
  res.end()
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});