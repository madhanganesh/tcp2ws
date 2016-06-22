var net = require('net');
const PORT = 4040;

const server = net.createServer(conn => {
    console.log('connected');

    conn.on('data', data => {
        console.log(`{data} from {conn.remoteAddress}:{conn.remotePort}`);
        conn.write('Repeating [' + data + '] from TCP server');
    });

    conn.on('close', () => {
        console.log('client closed connection');
    });
}).listen(PORT);

server.on('listening', () => {
    console.log('listening on port ' + PORT);
});

server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.log('Address in use, retrying....');
        setTimeout(() => {
            server.close();
            server.listen(PORT);
        }, 1000);
    } else {
        console.log(err);
    }
});
