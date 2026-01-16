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
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("chatHistory", ({ messages }) => {
      setMessages(messages);
    });

    socket.on("userTyping", ({ username }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.add(username);
        return next;
      });
    });

    socket.on("userStoppedTyping", ({ username }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(username);
        return next;
      });
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
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
        typingUsers,
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
