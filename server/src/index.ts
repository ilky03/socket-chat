import express from "express";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = new Set<string>();

io.on("connection", (socket) => {
  socket.on("send_message", ({ message, roomId, username }) => {
    io.to(roomId).emit("receive_message", { message, username });
  });

  socket.on("create_room", () => {
    const roomId = randomUUID();

    rooms.add(roomId);
    socket.join(roomId);
    io.emit("room_created", roomId);
  });

  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log(`🚀 Server ready at http://localhost:3000`);
});
