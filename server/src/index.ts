import express from "express";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Chat, ClientToServerEvents, ServerToClientEvents } from "./types";

// In-memory storage for chats and their messages
const chats: Array<Chat> = [];

const app = express();
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.emit("syncChats", { chats });

  socket.on("createChat", () => {
    const chatId = randomUUID();

    chats.unshift({ id: chatId, messages: [] });

    io.emit("chatCreated", { chatId });
  });

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);

    const chat = chats.find((chat) => chat.id === chatId);

    if (chat) {
      socket.emit("chatHistory", { messages: chat.messages });
    }
  });

  socket.on("sendMessage", ({ message, chatId, username }) => {
    chats
      .find((chat) => chat.id === chatId)
      ?.messages.push({ message, username });
    io.to(chatId).emit("receiveMessage", { message, username });
  });

  socket.on("userTyping", ({ username, chatId }) => {
    socket.to(chatId).emit("userTyping", { username });
  });

  socket.on("userStoppedTyping", ({ username, chatId }) => {
    socket.to(chatId).emit("userStoppedTyping", { username });
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log(`🚀 Server ready at http://localhost:3000`);
});
