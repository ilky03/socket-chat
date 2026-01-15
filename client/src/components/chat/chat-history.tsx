import { type FC } from "react";
import { useChat } from "../../context/chat-context-provider";
import { useAuth } from "../../context/auth-context-provider";
import { ChatMessage } from "./chat-message";

export const ChatHistory: FC = () => {
  const { messages, currentChat } = useChat();
  const { username: currentUsername } = useAuth();

  const hasMessages = messages.length > 0;

  if (!hasMessages) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center text-center text-gray-500">
        <div className="mb-2 text-4xl">💬</div>
        <p className="text-sm">
          No messages here yet.
          <br />
          {currentChat
            ? "Send a message to start the conversation!"
            : "Select or create a chat to view messages."}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 p-4 w-full flex-1 overflow-y-auto">
      {messages.map(({ message, username }, index) => (
        <ChatMessage
          key={index}
          message={message}
          username={username}
          isMe={username === currentUsername}
        />
      ))}
    </ul>
  );
};
