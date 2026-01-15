import {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket;
};

const SocketContextInternal = createContext<SocketContextType | undefined>(
  undefined
);

export const SocketContext: FC<PropsWithChildren> = ({ children }) => {
  const socket = io("http://localhost:3000");

  return (
    <SocketContextInternal.Provider value={{ socket }}>
      {children}
    </SocketContextInternal.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContextInternal);

  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }

  return context;
};
