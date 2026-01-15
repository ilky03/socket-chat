import { useEffect, useState, type FC } from "react";
import { useSocket } from "../../context/socket-context-provider";

export const Chat: FC = () => {
  const [messages, setMessages] = useState<Array<string>>([]);
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("receive_message", (newMessage: string) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return messages.map((msg, index) => <div key={index}>{msg}</div>);
};
