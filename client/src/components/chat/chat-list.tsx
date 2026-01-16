import { useState, type FC } from "react";
import clsx from "clsx";
import type { ChatsContextType } from "../../context/chats-context-provider";

type ChatListProps = Pick<ChatsContextType, "chats" | "currentChat"> & {
  onSelectChat: ChatsContextType["joinChat"];
  updateChatTitle: ChatsContextType["updateChatTitle"];
};

export const ChatList: FC<ChatListProps> = ({
  chats,
  currentChat,
  onSelectChat,
  updateChatTitle,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingChatId, setEditingChatId] = useState<string | null>(null);

  const hasChats = chats.length > 0;

  if (!hasChats) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
        <div className="mb-2 text-4xl">:(</div>
        <p className="text-sm">
          No chats yet.
          <br />
          Start a new conversation!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {chats.map((chat) => (
        <li key={chat.id}>
           {editingChatId === chat.id ? (
            <input
              autoFocus
              defaultValue={chat.title}
              onBlur={() => setEditingChatId(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateChatTitle(chat.id, e.currentTarget.value);
                  setEditingChatId(null);
                }
                 if (e.key === "Escape") {
                  setEditingChatId(null);
                }
              }}
              className="w-full rounded-md px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          ) : (
          <button
            onClick={() => onSelectChat(chat.id)}
            onDoubleClick={() => setEditingChatId(chat.id)}
            className={clsx(
              "w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 transition cursor-pointer flex justify-between group",
              currentChat === chat.id ? "bg-gray-200 font-medium" : "font-normal"
            )}
          >
            <span className="truncate">{chat.title}</span>
            <span className="opacity-0 group-hover:opacity-100 text-xs text-gray-400 ml-2 self-center">Double-click to edit</span>
          </button>
          )}
        </li>
      ))}
    </ul>
  );
};
