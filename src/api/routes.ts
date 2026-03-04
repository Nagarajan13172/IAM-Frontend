export const routes = {
  auth: {
    login: { path: "/auth/login" },
    register: { path: "/auth/register" },
    me: { path: "/auth/me" },
    logout: { path: "/auth/logout" },
  },

  users: {
    list: { path: "/users", permission: "manage_users" },
    create: { path: "/users", permission: "manage_users" },
    update: {
      path: (id: string) => `/users/${id}`,
      permission: "manage_users",
    },
    delete: {
      path: (id: string) => `/users/${id}`,
      permission: "manage_users",
    },
    disable: {
      path: (id: string) => `/users/${id}/disable`,
      permission: "manage_users",
    },
    enable: {
      path: (id: string) => `/users/${id}/enable`,
      permission: "manage_users",
    },
  },

  roles: {
    list: { path: "/roles", permission: "manage_roles" },
    create: { path: "/roles", permission: "manage_roles" },
    update: {
      path: (id: string) => `/roles/${id}`,
      permission: "manage_roles",
    },
    delete: {
      path: (id: string) => `/roles/${id}`,
      permission: "manage_roles",
    },
  },

  permissions: {
    list: { path: "/permissions", permission: "manage_permissions" },
    create: { path: "/permissions", permission: "manage_permissions" },
    delete: {
      path: (id: string) => `/permissions/${id}`,
      permission: "manage_permissions",
    },
  },

  sessions: {
    list: { path: "/sessions" },
    revoke: { path: (id: string) => `/sessions/${id}` },
    revokeAll: { path: "/sessions/revoke-all" },
  },

  auditLogs: {
    list: { path: "/admin/audit-logs", permission: "manage_users" },
  },
};
