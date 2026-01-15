import { useState, type FC } from "react";
import { useChat } from "../../context/chat-context-provider";

export const ChatInput: FC = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, currentChat } = useChat();

  if (!currentChat) {
    return <div>Please select a chat to send messages.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message, currentChat!);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
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
