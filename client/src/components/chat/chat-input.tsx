import { useState, type FC } from "react";
import { useSocket } from "../../context/socket-context-provider";

export const ChatInput: FC = () => {
  const [message, setMessage] = useState("");
  const { socket } = useSocket();

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("send_message", message);
    setMessage("");
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        type="text"
        value={message}
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};
