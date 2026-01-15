import type { FC } from "react";
import { useChat } from "../../context/chat-context-provider";

export const ChatSidebar: FC = () => {
  const { createNewChat, chats, joinChat } = useChat();

  return (
    <div>
      <ul>
        {chats.map((chat) => (
          <li key={chat}>
            <button onClick={() => joinChat(chat)}>{chat}</button>
          </li>
        ))}
      </ul>
      <button onClick={createNewChat}>Create new chat</button>
    </div>
  );
};
