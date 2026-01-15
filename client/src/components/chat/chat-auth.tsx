import { useEffect, useState, type FC } from "react";
import { useAuth } from "../../context/auth-context-provider";

export const ChatAuth: FC = () => {
  const [username, setUsername] = useState("");
  const { login, isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuth]);

  if (isAuth) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-lg font-semibold">Login required</h2>
        <p className="mb-4 text-sm text-muted-foreground text-gray-500">
          Please log in to access the chat features.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-black/90 transition cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};
