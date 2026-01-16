import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useSocket } from "./socket-context-provider";
import { useAuth } from "./auth-context-provider";
import { useChats, type ChatsContextType } from "./chats-context-provider";
import type { Message } from "../types";

export type ChatContextType = {
  sendMessage: (message: string) => void;
  userTyping: () => void;
  userStoppedTyping: () => void;
  messages: Array<Message>;
  currentChat: ChatsContextType["currentChat"];
  typingUsers: Set<string>;
  usersInChat: Array<string>;
  onlineUsersInChat: Array<string>;
};

const ChatContextInternal = createContext<ChatContextType | undefined>(
  undefined
);

/** Context for managing separate chat */
export const ChatContext: FC<PropsWithChildren> = ({ children }) => {
  const { socket } = useSocket();
  const { username } = useAuth();
  const { currentChat } = useChats();

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, Set<string>>>({});
  const [usersInChat, setUsersInChat] = useState<Record<string, Array<string>>>({});
  const [onlineUsersInChat, setOnlineUsersInChat] = useState<Record<string, Array<string>>>({});

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("chatHistory", ({ messages }) => {
      setMessages(messages);
    });

    socket.on("userTyping", ({ username, chatId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (!next[chatId]) {
          next[chatId] = new Set();
        }
        next[chatId] = new Set(next[chatId]).add(username);
        return next;
      });
    });

    socket.on("userStoppedTyping", ({ username, chatId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (next[chatId]) {
          const nextSet = new Set(next[chatId]);
          nextSet.delete(username);
          next[chatId] = nextSet;
        }
        return next;
      });
    });

    socket.on("chatUsersUpdate", ({ chatId, users, onlineUsers }) => {
      setUsersInChat((prev) => ({
        ...prev,
        [chatId]: users,
      }));
      setOnlineUsersInChat((prev) => ({
        ...prev,
        [chatId]: onlineUsers,
      }));
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("chatUsersUpdate");
    };
  }, [socket]);

  const sendMessage = (message: string) => {
    socket.emit("sendMessage", {
      message,
      chatId: currentChat!,
      username: username!,
    });
  };

  const userTyping = () => {
    socket.emit("userTyping", { username: username!, chatId: currentChat! });
  };

  const userStoppedTyping = () => {
    socket.emit("userStoppedTyping", {
      username: username!,
      chatId: currentChat!,
    });
  };

  return (
    <ChatContextInternal.Provider
      value={{
        sendMessage,
        userTyping,
        userStoppedTyping,
        messages,
        currentChat,
        typingUsers: (currentChat && typingUsers[currentChat]) || new Set(),
        usersInChat: (currentChat && usersInChat[currentChat]) || [],
        onlineUsersInChat: (currentChat && onlineUsersInChat[currentChat]) || [],
      }}
    >
      {children}
    </ChatContextInternal.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContextInternal);

  if (!context) {
    throw new Error("useChat must be used within a ChatContextProvider");
  }

  return context;
};
