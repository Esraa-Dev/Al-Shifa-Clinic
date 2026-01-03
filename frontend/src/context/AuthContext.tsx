import { createContext, useContext, useCallback } from "react";
import { useGetCurrentUser } from "../hooks/auth/useGetCurrentUser";
import { useLogout } from "../hooks/auth/useLogout";
import Loading from "../components/ui/Loading";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  image?: string;
  isEmailVerified: boolean;
  profileStatus: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetCurrentUser();
  const { mutate: logoutMutation } = useLogout();

  const logout = useCallback(() => {
    logoutMutation();
  }, [logoutMutation]);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        logout
      }}
    >
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};