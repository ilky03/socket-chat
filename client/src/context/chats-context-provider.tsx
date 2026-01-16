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
  createDirectChat: (targetUsername: string) => void;
  joinChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  chats: Array<{ id: string; title: string }>;
  currentChat: string | null;
};

const ChatsContextInternal = createContext<ChatsContextType | undefined>(
  undefined
);

/** Context for managing all chats */
export const ChatsContext: FC<PropsWithChildren> = ({ children }) => {
  const { socket } = useSocket();
  const { username } = useAuth();

  const [chats, setChats] = useState<Array<{ id: string; title: string }>>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
        socket.emit("identify", { username });
    }
  }, [socket, username]);

  useEffect(() => {
    socket.on("chatCreated", ({ chatId, title }) => {
      setChats((prevChats) => [{ id: chatId, title }, ...prevChats]);
    });

    socket.on("syncChats", ({ chats }) => {
      setChats(chats.map((chat) => ({ id: chat.id, title: chat.title })));
    });

    socket.on("chatTitleUpdated", ({ chatId, title }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, title } : chat
        )
      );
    });

    return () => {
      socket.off("syncChats");
      socket.off("chatCreated");
      socket.off("chatTitleUpdated");
    };
  }, [socket]);

  const createNewChat = () => {
    socket.emit("createChat");
  };

  const createDirectChat = (targetUsername: string) => {
    socket.emit("createDirectChat", { username: username!, targetUsername });
  };

  const updateChatTitle = (chatId: string, title: string) => {
    socket.emit("updateChatTitle", { chatId, title });
  };

  const joinChat = (chatId: string) => {
    setCurrentChat(chatId);

    socket.emit("joinChat", { chatId, username: username! });
  };

  return (
    <ChatsContextInternal.Provider
      value={{
        createNewChat,
        createDirectChat,
        joinChat,
        updateChatTitle,
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
