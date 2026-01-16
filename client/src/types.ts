type ChatId = string;
type Username = string;

export type Message = {
  message: string;
  username: Username;
};

export type Chat = {
  id: ChatId;
  messages: Message[];
};

type WithChatId = {
  chatId: ChatId;
};

type WithUsername = {
  username: Username;
};

type WithMessage = {
  message: string;
};

export type ServerToClientEvents = {
  syncChats: (payload: { chats: Chat[] }) => void;
  chatCreated: (payload: { chatId: ChatId }) => void;
  chatHistory: (payload: { messages: Message[] }) => void;
  receiveMessage: (payload: Message) => void;
  userTyping: (payload: WithChatId & WithUsername) => void;
  userStoppedTyping: (payload: WithChatId & WithUsername) => void;
};

export type ClientToServerEvents = {
  createChat: () => void;
  joinChat: (payload: WithChatId) => void;
  sendMessage: (payload: WithChatId & WithUsername & WithMessage) => void;
  userTyping: (payload: WithChatId & WithUsername) => void;
  userStoppedTyping: (payload: WithChatId & WithUsername) => void;
};
