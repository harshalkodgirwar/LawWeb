/**
 * Authentication Helpers & In-Memory / Local Storage Session Store
 * Handles hardcoded Admin credentials, user registration, and session synchronization.
 */

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "customer";
  user_metadata: {
    full_name: string;
    role: "admin" | "customer";
    created_at?: string;
  };
}

export interface StoredRegisteredUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string; // Plain/simple hash for local development
  createdAt: string;
}

// Hardcoded Admin Credentials
export const ADMIN_CREDENTIALS = {
  username: "admin",
  email: "admin@advharshal.com",
  passwords: ["admin123", "Admin@123", "admin"],
  name: "Adv. Harshal (Admin)",
};

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    !url.includes("placeholder-project") &&
    !url.includes("your-project-id") &&
    !url.includes("example.com") &&
    !key.includes("...") &&
    key.length > 50
  );
}

const DEMO_USER_KEY = "demo_user";
const REGISTERED_USERS_KEY = "registered_users";

// Default demo users if none created yet
const DEFAULT_STUDENT: StoredRegisteredUser = {
  id: "user-default-student-1",
  email: "student@example.com",
  fullName: "Pooja Sharma",
  passwordHash: "student123",
  createdAt: "2026-10-01T10:00:00Z",
};

export function getRegisteredUsers(): StoredRegisteredUser[] {
  if (typeof window === "undefined") return [DEFAULT_STUDENT];
  const stored = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!stored) {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([DEFAULT_STUDENT]));
    return [DEFAULT_STUDENT];
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [DEFAULT_STUDENT];
  } catch {
    return [DEFAULT_STUDENT];
  }
}

export function saveRegisteredUser(user: Omit<StoredRegisteredUser, "id" | "createdAt">): StoredRegisteredUser {
  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase().trim());
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const newUser: StoredRegisteredUser = {
    id: "user-" + Date.now(),
    email: user.email.toLowerCase().trim(),
    fullName: user.fullName.trim(),
    passwordHash: user.passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  if (typeof window !== "undefined") {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }
  return newUser;
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(DEMO_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("auth_state_changed"));
    window.dispatchEvent(new Event("storage"));
  }
}

export function clearCurrentUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMO_USER_KEY);
    window.dispatchEvent(new Event("auth_state_changed"));
    window.dispatchEvent(new Event("storage"));
  }
}

export function checkIsAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return (
    user.role === "admin" ||
    user.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() ||
    user.email.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() ||
    user.user_metadata?.role === "admin"
  );
}
