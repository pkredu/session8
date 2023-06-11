import express from 'express';
import path from 'path';
import http from 'http';
import {Server} from 'socket.io';
import { LocalStorage } from 'node-localstorage';
const iplocate = require("node-iplocate");
//import {publicIp} from 'public-ip';

let localstorage = new LocalStorage('./scratch');
var app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render('index.html');
})

let httpServer = http.createServer(app).listen(port,()=>{
    console.log(`SERVER running at ${port}`);
});

// get IP 
let publicIP ;
http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
  resp.on('data', function(ip) {
      publicIP = ip ;
    console.log("My public IP address is: " + ip);
  });
});

let io = new Server(httpServer);

io.sockets.on('connection',(socket)=>{
    console.log(`connection request recieved`);
    let connectionList = []
    //console.log(io.sockets.sockets.)
    io.sockets.sockets.forEach((socket)=>{
        connectionList.push(socket.id);
    })
    console.log(connectionList);

    socket.on('setName',(name)=>{
        // console.log(name);
        socket.username = name;
        console.log(socket.username);
        console.log(connectionList);
        socket.emit('connections',connectionList);
    })

    socket.on('newMsg',(msgData)=>{
        //console.log(socket.username);
        iplocate(publicIP)
        .then((data)=>{
            let city = data.city;
            //console.log(data);
            localstorage.setItem('userLocation',city);
        })
        let broadCastMsg = {
            message: msgData.message,
            sender : socket.username,
            location : localstorage.getItem('userLocation') 
        }
        console.log(broadCastMsg);
        socket.emit('updateChat',broadCastMsg);
        socket.broadcast.emit('updateChat',broadCastMsg);
    })

})

