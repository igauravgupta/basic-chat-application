import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("message", (data) => {
        console.log(data);
        io.to(data.room).emit("received", data.message); // Sends to all clients except the sender
    });
    socket.on('join-room',room=>{
        socket.join(room)
    })
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server is ready on http://localhost:3000");
});
