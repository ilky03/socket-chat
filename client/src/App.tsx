import { Chat } from "./components/chat/chat";
import { ChatInput } from "./components/chat/chat-input";
import { SocketContext } from "./context/socket-context-provider";

function App() {
  return (
    <SocketContext>
      <Chat />
      <ChatInput />
    </SocketContext>
  );
}

export default App;
