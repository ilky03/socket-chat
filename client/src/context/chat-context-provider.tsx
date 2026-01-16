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
  messages: Array<Message>;
  currentChat: ChatsContextType["currentChat"];
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

  useEffect(() => {
    socket.on("receive_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("room_history", (roomMessages: Array<Message>) => {
      setMessages(roomMessages);
    });

    return () => {
      socket.off("receive_message");
      socket.off("room_history");
    };
  }, [socket]);

  const sendMessage = (message: string) => {
    socket.emit("send_message", { message, roomId: currentChat, username });
  };

  return (
    <ChatContextInternal.Provider
      value={{
        sendMessage,
        messages,
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
