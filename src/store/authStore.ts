import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, routes } from "@/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
    permissions: string[];
  } | null;
  isActive: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: string[];

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: [],

      login: async (email: string, password: string) => {
        const res = await api.post<{
          token: string;
          user: User;
          permissions: string[];
        }>(routes.auth.login.path, { email, password });

        const { token, user, permissions } = res.data;

        // Store token first so the fetchMe call below can attach it to headers
        const perms: string[] =
          permissions ??
          (Array.isArray(user.role?.permissions)
            ? user.role!.permissions
            : []);

        set({ token, user, permissions: perms });

        // Re-fetch full profile to guarantee permissions are always populated
        // (covers cases where login response role was a plain string)
        try {
          const meRes = await api.get<{ user: User; permissions?: string[] }>(
            routes.auth.me.path,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const meUser = meRes.data.user ?? (meRes.data as unknown as User);
          const mePerms: string[] =
            meRes.data.permissions ??
            (Array.isArray(meUser.role?.permissions)
              ? (meUser.role!.permissions as unknown as string[])
              : []);
          set({ user: meUser, permissions: mePerms });
        } catch {
          // fetchMe failed — keep what login returned
        }
      },

      register: async (name: string, email: string, password: string) => {
        const res = await api.post<{
          token: string;
          user: User;
        }>(routes.auth.register.path, { name, email, password });

        const { token, user } = res.data;

        const perms: string[] = Array.isArray(user.role?.permissions)
          ? user.role!.permissions
          : [];

        set({ token, user, permissions: perms });
      },

      logout: async () => {
        try {
          await api.post(routes.auth.logout.path);
        } catch {
          // ignore
        }
        set({ user: null, token: null, permissions: [] });
      },

      fetchMe: async () => {
        const res = await api.get<{ user: User; permissions?: string[] }>(routes.auth.me.path);
        const user = res.data.user ?? (res.data as unknown as User);
        // Prefer top-level permissions array returned by the server
        const perms: string[] =
          res.data.permissions ??
          (Array.isArray(user.role?.permissions)
            ? (user.role!.permissions as unknown as string[])
            : []);
        set({ user, permissions: perms });
      },

      setUser: (user: User) => {
        const perms: string[] = Array.isArray(user.role?.permissions)
          ? user.role!.permissions
          : [];
        set({ user, permissions: perms });
      },

      setToken: (token: string) => set({ token }),

      hasPermission: (permission: string) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      isAuthenticated: () => {
        return !!get().token;
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
      }),
    }
  )
);
