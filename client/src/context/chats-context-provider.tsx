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

export type ChatsContextType = {
  createNewChat: () => void;
  joinChat: (chatId: string) => void;
  chats: Array<string>;
  currentChat: string | null;
};

const ChatsContextInternal = createContext<ChatsContextType | undefined>(
  undefined
);

/** Context for managing all chats */
export const ChatsContext: FC<PropsWithChildren> = ({ children }) => {
  const { socket } = useSocket();
  const { username } = useAuth();

  const [chats, setChats] = useState<Array<string>>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);

  useEffect(() => {
    socket.on("chatCreated", ({ chatId }) => {
      setChats((prevChats) => [chatId, ...prevChats]);
    });

    socket.on("syncChats", ({ chats }) => {
      setChats(chats.map((chat: { id: string }) => chat.id));
    });

    return () => {
      socket.off("syncChats");
      socket.off("chatCreated");
    };
  }, [socket]);

  const createNewChat = () => {
    socket.emit("createChat");
  };

  const joinChat = (chatId: string) => {
    setCurrentChat(chatId);

    socket.emit("joinChat", { chatId, username: username! });
  };

  return (
    <ChatsContextInternal.Provider
      value={{
        createNewChat,
        joinChat,
        chats,
        currentChat,
      }}
    >
      {children}
    </ChatsContextInternal.Provider>
  );
};

export const useChats = () => {
  const context = useContext(ChatsContextInternal);

  if (!context) {
    throw new Error("useChats must be used within a ChatsContextProvider");
  }

  return context;
};
