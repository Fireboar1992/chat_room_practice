const express = require('express');
const app = express();
// For solving the issue, Request to access from origin has been blocked by CORS policy
const cors = require('cors')
app.use(cors({
    origin: '*'
}));
const http = require('http');
const server = http.createServer(app);

// const io = require('socket.io')(http);
const { Server } = require('socket.io');
// For solving the issue, Request to access from origin has been blocked by CORS policy
const io = new Server(server, {
    allowEI03: true,
    cors: {
        origin: 'http://localhost:52330',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket)=>{
    console.log('user connect', socket.id);

    socket.on('new_message', (message)=>{
        console.log('client says', message);
        io.emit('new_message', 'Yes client ?');
    }) 

})


app.get('/', (request, response)=>{
    response.send('hello world');
})

const port = 3000;

server.listen(port, ()=>{
    console.log('Listen to the port ' + port);
})
