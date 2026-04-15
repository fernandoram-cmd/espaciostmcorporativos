import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkEmailExists: (email: string) => boolean;
  getAllUsers: () => StoredUser[];
  getTicketPermissions: () => Record<string, boolean>;
  setTicketPermission: (email: string, allowed: boolean) => void;
  hasTicketAccess: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "ec_users";
const SESSION_KEY = "ec_session";
const PERMISSIONS_KEY = "ec_ticket_permissions";

const ADMIN_EMAIL = "ramirez.ferni1545@gmail.com";
const ADMIN_PASSWORD = "Liapig1573";

export interface StoredUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedAdmin() {
  const users = getStoredUsers();
  const adminExists = users.some((u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  if (!adminExists) {
    saveUsers([
      ...users,
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "Administrador", role: "admin" },
    ]);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedAdmin();
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const checkEmailExists = (email: string): boolean => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
    const users = getStoredUsers();
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: "Correo o contraseña incorrectos." };
    }
    const sessionUser: User = { email: found.email, name: found.name, role: found.role };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: "Este correo ya tiene una cuenta." };
    }
    const users = getStoredUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: "Este correo ya tiene una cuenta." };
    }
    const newUser: StoredUser = { email, password, name, role: "Account Manager" };
    saveUsers([...users, newUser]);
    const sessionUser: User = { email: newUser.email, name: newUser.name, role: newUser.role };
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const getAllUsers = (): StoredUser[] => {
    return getStoredUsers().filter((u) => u.role !== "admin");
  };

  const getTicketPermissions = (): Record<string, boolean> => {
    try {
      const data = localStorage.getItem(PERMISSIONS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const setTicketPermission = (email: string, allowed: boolean) => {
    const perms = getTicketPermissions();
    perms[email.toLowerCase()] = allowed;
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(perms));
  };

  const hasTicketAccess = (email: string): boolean => {
    const perms = getTicketPermissions();
    return !!perms[email.toLowerCase()];
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, checkEmailExists,
      getAllUsers, getTicketPermissions, setTicketPermission, hasTicketAccess,
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
