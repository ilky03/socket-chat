import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useSocket } from "./socket-context-provider";

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

  const [chats, setChats] = useState<Array<string>>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);

  useEffect(() => {
    socket.on("room_created", (roomId: string) => {
      setChats((prevChats) => [roomId, ...prevChats]);
    });

    socket.on("sync_rooms", (rooms) => {
      setChats(rooms.rooms.map((room: { id: string }) => room.id));
    });

    return () => {
      socket.off("sync_rooms");
      socket.off("room_created");
    };
  }, [socket]);

  const createNewChat = () => {
    socket.emit("create_room");
  };

  const joinChat = (chatId: string) => {
    setCurrentChat(chatId);

    socket.emit("join_room", chatId);
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
