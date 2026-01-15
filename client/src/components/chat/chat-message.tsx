import clsx from "clsx";
import type { FC } from "react";

type ChatMessageProps = {
  message: string;
  isMe: boolean;
  username: string;
};

export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  isMe,
  username,
}) => {
  return (
    <li
      className={clsx("flex flex-col gap-1 items-start", isMe && "items-end!")}
    >
      <span className="text-xs text-gray-500">{isMe ? "You" : username}</span>
      <div
        className={clsx(
          "w-fit max-w-[80%] rounded-lg bg-gray-100 px-3 py-2 text-sm",
          isMe && "bg-black! text-white"
        )}
      >
        {message}
      </div>
    </li>
  );
};
