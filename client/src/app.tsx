import { ChatHistory } from "./components/chat/chat-history";
import { ChatInput } from "./components/chat/chat-input";
import { SocketContext } from "./context/socket-context-provider";
import { ChatSidebar } from "./components/chat/chat-sidebar";
import { ChatContext } from "./context/chat-context-provider";
import { ChatWrapper } from "./components/chat/chat-wrapper";
import { ChatAuth } from "./components/chat/chat-auth";
import { AuthContext } from "./context/auth-context-provider";

function App() {
  return (
    <SocketContext>
      <AuthContext>
        <ChatContext>
          <ChatWrapper>
            <ChatAuth />
            <ChatSidebar />
            <ChatHistory />
            <ChatInput />
          </ChatWrapper>
        </ChatContext>
      </AuthContext>
    </SocketContext>
  );
}

export default App;
