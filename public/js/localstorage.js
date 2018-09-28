$(function () {
  var username = localStorage.getItem("username");
  var socket = io();
  $('#message-container form').submit(function(){
    var msg = $('#m').val();
    if (msg === '/logout') {
      localStorage.clear();
      updateUi(null)
      $('#m').val('');
      return false;
    }
    var payload = {
      username: username,
      msg : msg
    }
    socket.emit('chat message', payload);
    $('#m').val('');
    return false;
  });
  socket.on('messages', function(messages) {
    console.log(messages);
    messages.forEach(appendMessage);
  });
  socket.on('chat message', appendMessage);

  $('#username-container form').submit(function(){
    username = $('#username').val();
    localStorage.setItem('username', username);
    $('#username').val('');
    updateUi(username);
    return false;
  });

  //force update at start
  updateUi(username);
  
  //util functions...
  function updateUi(username) {
    if (username) {
      $('#username-container').hide();
      $('#message-container').show();
      $('#message-container form input').focus();
    } else {
      $('#message-container').hide();
      $('#username-container').show();
      $('#username-container form input').focus();
    }
  }
  function appendMessage(data) {
    var m = $('<li>');
    m.append($('<b>').text(`${data.username}: `))
    m.append($('<span>').text(data.msg))
    $('#messages').append(m);
  }
});