import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthSession } from "../types/models";
import * as authService from "../services/authService";

const STORAGE_KEY = "authority-auth-session";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isAuthorityAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (session: AuthSession | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSessionState] = useState<AuthSession | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as AuthSession;
    return parsed.user.role === "authority" ? parsed : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const setSession = (nextSession: AuthSession | null) => {
    setSessionState(nextSession);
  };

  const login = async (email: string, password: string) => {
    const nextSession = await authService.login({ email, password });

    if (nextSession.user.role !== "authority") {
      throw new Error("Only authority accounts can access this dashboard.");
    }

    setSessionState(nextSession);
  };

  const logout = async () => {
    if (session?.refreshToken) {
      await authService.logout(session.refreshToken).catch(() => undefined);
    }
    setSessionState(null);
  };

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.accessToken),
      isAuthorityAuthenticated:
        Boolean(session?.accessToken) && session?.user.role === "authority",
      login,
      logout,
      setSession,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
