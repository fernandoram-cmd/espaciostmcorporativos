import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  role: string;
}

export interface StoredUser {
  email: string;
  name: string;
  role: string;
  hasAccess: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkEmailExists: (email: string) => Promise<boolean>;
  getAllUsers: () => Promise<StoredUser[]>;
  setTicketPermission: (email: string, allowed: boolean) => Promise<void>;
  hasTicketAccess: (email: string) => Promise<boolean>;
  deleteUser: (email: string) => Promise<void>;
  changeUserPassword: (email: string, newPassword: string) => Promise<void>;
  approveAll: () => Promise<void>;
  revokeAll: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "ec_session";
const API = "/api";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    try {
      const res = await apiFetch("/auth/check-email", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return !!data.exists;
    } catch {
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error ?? "Error al iniciar sesión" };
      }
      const data = await res.json();
      const sessionUser: User = data.user;
      setUser(sessionUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error ?? "Error al registrarse" };
      }
      const data = await res.json();
      const sessionUser: User = data.user;
      setUser(sessionUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const getAllUsers = useCallback(async (): Promise<StoredUser[]> => {
    try {
      const res = await apiFetch("/admin/users");
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }, []);

  const setTicketPermission = useCallback(async (email: string, allowed: boolean) => {
    await apiFetch(`/admin/users/${encodeURIComponent(email)}/permission`, {
      method: "POST",
      body: JSON.stringify({ allowed }),
    });
  }, []);

  const hasTicketAccess = useCallback(async (email: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`/admin/permissions/${encodeURIComponent(email)}`);
      if (!res.ok) return false;
      const data = await res.json();
      return !!data.allowed;
    } catch {
      return false;
    }
  }, []);

  const deleteUser = useCallback(async (email: string) => {
    await apiFetch(`/admin/users/${encodeURIComponent(email)}`, { method: "DELETE" });
  }, []);

  const changeUserPassword = useCallback(async (email: string, newPassword: string) => {
    await apiFetch(`/admin/users/${encodeURIComponent(email)}/password`, {
      method: "PUT",
      body: JSON.stringify({ password: newPassword }),
    });
  }, []);

  const approveAll = useCallback(async () => {
    await apiFetch("/admin/permissions/approve-all", { method: "POST" });
  }, []);

  const revokeAll = useCallback(async () => {
    await apiFetch("/admin/permissions/revoke-all", { method: "POST" });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, checkEmailExists,
      getAllUsers, setTicketPermission, hasTicketAccess,
      deleteUser, changeUserPassword, approveAll, revokeAll,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
