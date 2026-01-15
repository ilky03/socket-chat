import { type FC } from "react";
import { useChat } from "../../context/chat-context-provider";

export const ChatHistory: FC = () => {
  const { messages } = useChat();

  return (
    <ul>
      {messages.map((msg, index) => (
        <li key={index}>{msg}</li>
      ))}
    </ul>
  );
};
