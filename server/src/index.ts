import express from "express";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { Server } from "socket.io";

type Room = {
  id: string;
  messages: Array<{
    message: string;
    username: string;
  }>;
  users: Array<string>;
};

// In-memory storage for rooms and their messages
const rooms: Array<Room> = [];

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.emit("sync_rooms", { rooms });

  socket.on("create_room", () => {
    const roomId = randomUUID();

    rooms.unshift({ id: roomId, messages: [], users: [] });

    io.emit("room_created", roomId);
  });

  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);

    const room = rooms.find((room) => room.id === roomId);

    if (room) {
      socket.emit("room_history", room.messages);
    }
  });

  socket.on("send_message", ({ message, roomId, username }) => {
    rooms
      .find((room) => room.id === roomId)
      ?.messages.push({ message, username });
    io.to(roomId).emit("receive_message", { message, username });
  });

  socket.on("user_typing", ({ username, roomId }) => {
    socket.to(roomId).emit("user_typing", username);
  });

  socket.on("user_stopped_typing", ({ username, roomId }) => {
    socket.to(roomId).emit("user_stopped_typing", username);
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log(`🚀 Server ready at http://localhost:3000`);
});
