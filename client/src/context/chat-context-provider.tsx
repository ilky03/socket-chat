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

type Message = {
  message: string;
  username: string;
};

type ChatContextType = {
  sendMessage: (message: string, currentChat: string) => void;
  createNewChat: () => void;
  joinChat: (chatId: string) => void;
  messages: Array<Message>;
  chats: Array<string>;
  currentChat: string | null;
};

const ChatContextInternal = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatContext: FC<PropsWithChildren> = ({ children }) => {
  const { socket } = useSocket();
  const { username } = useAuth();

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [chats, setChats] = useState<Array<string>>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);

  useEffect(() => {
    socket.on("receive_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("room_created", (roomId: string) => {
      setChats((prevChats) => [...prevChats, roomId]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("room_created");
    };
  }, [socket]);

  const sendMessage = (message: string, currentChat: string) => {
    socket.emit("send_message", { message, roomId: currentChat, username });
  };

  const createNewChat = () => {
    socket.emit("create_room");
  };

  const joinChat = (chatId: string) => {
    setCurrentChat(chatId);
    setMessages([]);

    socket.emit("join_room", chatId);
  };

  return (
    <ChatContextInternal.Provider
      value={{
        sendMessage,
        createNewChat,
        joinChat,
        messages,
        chats,
        currentChat,
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
