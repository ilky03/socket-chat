import type { FC } from "react";
import { useChat } from "../../context/chat-context-provider";
import { useAuth } from "../../context/auth-context-provider";
import { useChats } from "../../context/chats-context-provider";

export const UserList: FC = () => {
  const { usersInChat, onlineUsersInChat } = useChat();
  const { username: currentUsername } = useAuth();
  const { createDirectChat } = useChats();

  return (
    <div className="col-start-3 row-start-1 row-span-2 w-64 border-l bg-white h-full flex flex-col">
      <div className="p-4 border-b font-semibold text-sm">
        Users ({usersInChat.length})
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {usersInChat.map((user) => {
          const isOnline = onlineUsersInChat.includes(user);
          const isMe = user === currentUsername;
          
          return (
            <div
              key={user}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 text-sm group justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user.charAt(0).toUpperCase()}
                    </div>
                    <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-300"
                    }`}
                    />
                </div>
                <span className="truncate">{user} {isMe && "(You)"}</span>
              </div>
              
              {!isMe && (
                  <button 
                    onClick={() => createDirectChat(user)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition cursor-pointer text-xs font-semibold text-blue-600"
                  >
                    DM
                  </button>
              )}
            </div>
          );
        })}
        {usersInChat.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
                No users here?
            </div>
        )}
      </div>
    </div>
  );
};
