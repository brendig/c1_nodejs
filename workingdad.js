
var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs'),
	connectionsArray = [];
	// creating the server ( localhost:8000 )
	app.listen(8001);

// on server started we can load our client.html page
function handler(req, res) {
  fs.readFile(__dirname + '/workingdad/index.php', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading');
    }
    res.writeHead(200);
    res.end(data);
  });
}


// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {

  console.log('Number of connections:' + connectionsArray.length);
  // starting the loop only if at least there is one user connected
  if (!connectionsArray.length) {
    //pollingLoop();
  }

  socket.on('fromclient',function(order){
		updateSockets(order);
//		socket.broadcast.emit('notification',data); // 자신을 제외하고 다른 클라이언트에게 보냄
		console.log('order :'+order.comp_code);
//		console.log(data.users[0].mk_idx);
   });

  socket.on('disconnect', function() {
    var socketIndex = connectionsArray.indexOf(socket);
    console.log('socketID = %s got disconnected', socketIndex);
    if (~socketIndex) {
      connectionsArray.splice(socketIndex, 1);
    }
  });

  console.log('A new socket is connected!');
  connectionsArray.push(socket);

});

var updateSockets = function(order) {
  // adding the time of the last update
  var time = new Date();
  console.log('Pushing new data to the clients connected ( connections amount = %s ) - %s', connectionsArray.length , time);
  // sending new data to all the sockets connected
  connectionsArray.forEach(function(tmpSocket) {
    tmpSocket.volatile.emit('notification', order);
//	console.log(data.users[0].mk_idx);
  });
};

