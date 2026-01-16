import type { FC, PropsWithChildren } from "react";

export const ChatWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[1fr_auto] h-screen overflow-hidden">
      {children}
    </div>
  );
};
