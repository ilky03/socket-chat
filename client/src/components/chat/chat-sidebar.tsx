import type { FC } from "react";
import { useChats } from "../../context/chats-context-provider";
import { ChatList } from "./chat-list";

export const ChatSidebar: FC = () => {
  const { createNewChat, currentChat, chats, joinChat } = useChats();

  return (
    <aside className="col-start-1 row-span-2 flex w-64 flex-col bg-white h-screen border-r">
      <div className="border-b px-4 py-3 text-sm font-semibold">Chats</div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ChatList
          chats={chats}
          currentChat={currentChat}
          onSelectChat={joinChat}
        />
      </nav>

      <div className="border-t p-3">
        <button
          onClick={createNewChat}
          className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90 transition cursor-pointer"
        >
          + New chat
        </button>
      </div>
    </aside>
  );
};
