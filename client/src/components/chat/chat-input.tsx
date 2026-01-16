import { useState, type FC } from "react";
import { useChat } from "../../context/chat-context-provider";

export const ChatInput: FC = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, currentChat } = useChat();

  if (!currentChat) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t flex flex-row gap-3">
      <input
        type="text"
        value={message}
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value)}
        className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
      />
      <button
        type="submit"
        className="h-9 rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90 transition cursor-pointer"
      >
        Send
      </button>
    </form>
  );
};
