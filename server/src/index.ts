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

// Track socketId -> username for disconnect handling
const socketUserMap = new Map<string, string>();

io.on("connection", (socket) => {
  socket.emit("syncChats", { chats });

  socket.on("createChat", () => {
    const chatId = randomUUID();
    const title = `New Chat ${chats.length + 1}`;

    chats.unshift({ 
        id: chatId, 
        title, 
        messages: [], 
        users: [], 
        onlineUsers: [] 
    });

    io.emit("chatCreated", { chatId, title });
  });

  socket.on("joinChat", ({ chatId, username }) => {
    socket.join(chatId);
    socketUserMap.set(socket.id, username);

    const chat = chats.find((chat) => chat.id === chatId);

    if (chat) {
      if (!chat.users.includes(username)) {
        chat.users.push(username);
      }
      
      if (!chat.onlineUsers.includes(username)) {
        chat.onlineUsers.push(username);
      }

      io.to(chatId).emit("chatUsersUpdate", { 
        chatId, 
        users: chat.users,
        onlineUsers: chat.onlineUsers 
      });
      socket.emit("chatHistory", { messages: chat.messages });
    }
  });

  socket.on("sendMessage", ({ message, chatId, username }) => {
    // We get username here. Maybe update map here?
    socketUserMap.set(socket.id, username);
    
    chats
      .find((chat) => chat.id === chatId)
      ?.messages.push({ message, username });
    io.to(chatId).emit("receiveMessage", { message, username });
  });

  socket.on("userTyping", ({ username, chatId }) => {
     socketUserMap.set(socket.id, username);
    socket.to(chatId).emit("userTyping", { username, chatId });
  });

  socket.on("userStoppedTyping", ({ username, chatId }) => {
    socket.to(chatId).emit("userStoppedTyping", { username, chatId });
  });

  socket.on("updateChatTitle", ({ chatId, title }) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
        chat.title = title;
        io.emit("chatTitleUpdated", { chatId, title });
    }
  });

  socket.on("disconnect", () => {
    const username = socketUserMap.get(socket.id);
    if (username) {
        // Remove user from all chats
        chats.forEach(chat => {
            const onlineIndex = chat.onlineUsers.indexOf(username);
            if (onlineIndex !== -1) {
                chat.onlineUsers.splice(onlineIndex, 1);
                 io.to(chat.id).emit("chatUsersUpdate", { 
                    chatId: chat.id, 
                    users: chat.users, 
                    onlineUsers: chat.onlineUsers 
                });
            }
        });
        socketUserMap.delete(socket.id);
    }
  });
});

server.listen(3000, () => {
  console.log(`🚀 Server ready at http://localhost:3000`);
});
