import { ChatHistory } from "./components/chat/chat-history";
import { ChatInput } from "./components/chat/chat-input";
import { SocketContext } from "./context/socket-context-provider";
import { ChatSidebar } from "./components/chat/chat-sidebar";
import { ChatContext } from "./context/chat-context-provider";
import { ChatWrapper } from "./components/chat/chat-wrapper";

function App() {
  return (
    <SocketContext>
      <ChatContext>
        <ChatWrapper>
          <ChatSidebar />
          <ChatHistory />
          <ChatInput />
        </ChatWrapper>
      </ChatContext>
    </SocketContext>
  );
}

export default App;
