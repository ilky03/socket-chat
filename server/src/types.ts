type ChatId = string;
type Username = string;

export type Message = {
  message: string;
  username: Username;
};

export type Chat = {
  id: ChatId;
  title: string;
  messages: Message[];
  users: Username[];
  onlineUsers: Username[];
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
  chatCreated: (payload: { chatId: ChatId; title: string }) => void;
  chatHistory: (payload: { messages: Message[] }) => void;
  receiveMessage: (payload: Message) => void;
  userTyping: (payload: WithChatId & WithUsername) => void;
  userStoppedTyping: (payload: WithChatId & WithUsername) => void;
  chatUsersUpdate: (payload: {
    chatId: ChatId;
    users: Username[];
    onlineUsers: Username[];
  }) => void;
  chatTitleUpdated: (payload: { chatId: ChatId; title: string }) => void;
};

export type ClientToServerEvents = {
  createChat: () => void;
  joinChat: (payload: WithChatId & WithUsername) => void;
  sendMessage: (payload: WithChatId & WithUsername & WithMessage) => void;
  userTyping: (payload: WithChatId & WithUsername) => void;
  userStoppedTyping: (payload: WithChatId & WithUsername) => void;
  updateChatTitle: (payload: { chatId: ChatId; title: string }) => void;
};
