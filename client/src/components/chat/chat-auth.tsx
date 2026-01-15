import { useState, type FC } from "react";
import { useAuth } from "../../context/auth-context-provider";

export const ChatAuth: FC = () => {
  const [username, setUsername] = useState("");
  const { login, isAuth } = useAuth();

  if (isAuth) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Please log in to access the chat features.</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Log In</button>
    </form>
  );
};
