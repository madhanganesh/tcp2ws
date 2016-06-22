var http = require('http').createServer(httpHandler),
    fs = require("fs"),
    wsock = require('socket.io').listen(http),
    tcpsock = require('net');

var http_port = 8888;

var tcp_HOST = 'localhost';
var tcp_PORT = 4040;

/**
 * http server
 */
function httpHandler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

http.listen(http_port);
console.info("HTTP server listening on " + http_port);

wsock.sockets.on('connection', function (socket) { 

    var tcpClient = new tcpsock.Socket();
    tcpClient.setEncoding('ascii');
    tcpClient.setKeepAlive(true);

    tcpClient.connect(tcp_PORT, tcp_HOST, function() {
        console.info('CONNECTED TO : ' + tcp_HOST + ':' + tcp_PORT);

        tcpClient.on('data', function(data) {
            console.log('DATA: ' + data);
            socket.emit('wsdata', data);
        });

        tcpClient.on('end', function(data) {
            console.log('END DATA : ' + data);
        });
    });

    socket.on('wsdata', function(message) {
        console.log('WebSocket received ' + message);
        tcpClient.write(message);
    });

    socket.emit('wsdata', 'Initial Data');
});

