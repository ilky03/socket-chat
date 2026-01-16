import type { FC } from "react";
import clsx from "clsx";
import type { ChatsContextType } from "../../context/chats-context-provider";

type ChatListProps = Pick<ChatsContextType, "chats" | "currentChat"> & {
  onSelectChat: ChatsContextType["joinChat"];
};

export const ChatList: FC<ChatListProps> = ({
  chats,
  currentChat,
  onSelectChat,
}) => {
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
        <li key={chat}>
          <button
            onClick={() => onSelectChat(chat)}
            className={clsx(
              "w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 transition cursor-pointer",
              currentChat === chat ? "bg-gray-200 font-medium" : "font-normal"
            )}
          >
            {chat}
          </button>
        </li>
      ))}
    </ul>
  );
};
