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

type Message = {
  message: string;
  username: string;
};

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
    socket.on("receive_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("room_history", (roomMessages: Array<Message>) => {
      setMessages(roomMessages);
    });

    socket.on("user_typing", (username: string) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.add(username);
        return next;
      });
    });

    socket.on("user_stopped_typing", (username: string) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(username);
        return next;
      });
    });

    return () => {
      socket.off("receive_message");
      socket.off("room_history");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [socket]);

  const sendMessage = (message: string) => {
    socket.emit("send_message", { message, roomId: currentChat, username });
  };

  const userTyping = () => {
    socket.emit("user_typing", { username, roomId: currentChat });
  };

  const userStoppedTyping = () => {
    socket.emit("user_stopped_typing", { username, roomId: currentChat });
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
