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

const userList = {};

io.on('connection', (socket)=>{

    // const liveUser = [];

    console.log('socket-id: ', socket.id);

    socket.on('user_join', (sender)=>{

        console.log('user_name', sender.name);

        userList[sender.name] = {id: socket.id}
        
        // examine the sender is same with receiver or not

        // if(liveUser.includes(currentUser)){
        //     io.emit('user_name_occupied', `user's name ${currentUser} is occupied`);
        // }

        // liveUser.push(currentUser);

        io.emit('new_message', {sender: 'server', text:`${sender.name} join the room`});
    })

    socket.on('receiver_choose', (receiver)=>{

        console.log('receiver_name', receiver.name);

        io.emit('new_message', {sender: 'server', text: `choose ${receiver.name} as the receiver`});

    });

    // test the server receive the msg or not 

    socket.on('new_message', (message)=>{
        // console.log('client says', message);
        console.log(message);
        if(userList[message.receiver]){
            io.to(userList[message.receiver].id).emit('new_message', {sender: message.sender, text: message.text});
        }else{
            io.emit('new_message', {sender: message.sender, text: message.text});
        }
    }) 

    // socket.on('disconnect', ()=>{
    //     console.log('user disconnected');
    // });

})


app.get('/', (request, response)=>{
    response.send('hello world');
})

const port = 3000;

server.listen(port, ()=>{
    console.log('Listen to the port ' + port);
})
