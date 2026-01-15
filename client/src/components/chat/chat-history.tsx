import { type FC } from "react";
import { useChat } from "../../context/chat-context-provider";

export const ChatHistory: FC = () => {
  const { messages } = useChat();

  return (
    <ul>
      {messages.map(({ message, username }, index) => (
        <li key={index}>
          {username}: {message}
        </li>
      ))}
    </ul>
  );
};
