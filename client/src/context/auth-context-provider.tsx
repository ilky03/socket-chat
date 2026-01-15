import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

type AuthContextType = {
  username?: string;
  login: (name: string) => void;
  isAuth: boolean;
};

const AuthContextInternal = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContext: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState<string | undefined>(
    () => localStorage.getItem("username") ?? undefined
  );

  const login = (name: string) => {
    setUsername(name);

    localStorage.setItem("username", name);
  };

  return (
    <AuthContextInternal.Provider
      value={{ username, login, isAuth: Boolean(username) }}
    >
      {children}
    </AuthContextInternal.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContextInternal);

  if (!context) {
    throw new Error("useAuth must be used within an AuthContext");
  }

  return context;
};
