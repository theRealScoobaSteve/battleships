// import "reflect-metadata";
// import {createConnection} from "typeorm";

// import { createServer } from "http";
// import { Server, Socket } from "socket.io";



// const httpServer = createServer();
// const io = new Server(httpServer, {});

// const connections = [];

// io.on("connection", (socket) => {
//    console.log(socket);
// });

// httpServer.listen(3000);
// console.log("HERE")

import cors  from "cors";
import express from 'express';
// const app = express();

// app.set( "ipaddr", "127.0.0.1" );
// app.set( "port", 8080 );
// app.use(cors());

// const server = require('http').createServer(app);
// const port = 8080;

var app = express();

app.use(cors());

var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http, {
  cors: {
    origin: '*',
  }
});
http.listen(8080, "127.0.0.1", () => {
   console.log("LISTENING")
});


io.on('connection',function(socket){  
    console.log("A user is connected");
    socket.on('event',function(socket){  
    console.log("event");

    io.emit("fire_event", "HELLO");
});
});

