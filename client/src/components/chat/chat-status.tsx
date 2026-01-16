import type { FC } from "react";
import { useChat } from "../../context/chat-context-provider";

export const ChatStatus: FC = () => {
  const { typingUsers } = useChat();

  if (typingUsers.size === 0) return null;

  const text = getTypingText([...typingUsers]);

  return (
    <div className="text-xs opacity-70 absolute left-3 -top-6">{text}</div>
  );
};

const getTypingText = (users: string[]): string => {
  const count = users.length;

  if (count === 0) return "";
  if (count === 1) return `${users[0]} is typing...`;
  if (count === 2) return `${users[0]} and ${users[1]} are typing...`;

  return `${users[0]}, ${users[1]} and ${count - 2} others are typing...`;
};
