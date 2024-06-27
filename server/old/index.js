const express =require("express");
const app =express();

const http = require("http")
const server = http.createServer(app);

const {Server}= require("socket.io")
const io = new Server(server)

app.use(express.static("/public"))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})


//sockets
io.on('connection', (socket) => {
    console.log(`a user connected with id ${socket.id}`);
    socket.on("user-message",(a)=>{
    io.emit("reply",a);
    console.log("reply send")
    })
  });

server.listen(3000);