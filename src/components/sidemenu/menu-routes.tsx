import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Key,
  MonitorSmartphone,
  ClipboardList,
  Settings,
  UserCircle,
  Eye,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavRoute {
  to: string;
  label: string;
  icon: LucideIcon;
  /** If set, only show this item when the user has this permission */
  permission?: string;
}

export interface NavGroup {
  label: string;
  items: NavRoute[];
}

// ── Grouped menu structure ────────────────────────────────────────────────────
//
//  General      → visible to ALL authenticated users
//  Manager      → visible only to roles with view_users
//  Admin Tools  → visible only to roles with manage_users / manage_roles / manage_permissions
//
export const menuGroups: NavGroup[] = [
  {
    label: "General",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        // No permission — everyone sees the dashboard
      },
      {
        to: "/sessions",
        label: "My Sessions",
        icon: MonitorSmartphone,
        // No permission — every user can view their own sessions
      },
      {
        to: "/profile",
        label: "My Profile",
        icon: UserCircle,
        // No permission — every user can view their profile
      },
    ],
  },
  {
    label: "Manager",
    items: [
      {
        to: "/users",
        label: "View Users",
        icon: Eye,
        // Shown to Manager (view_users) but NOT Admin (manage_users takes over in Admin Tools)
        // We handle deduplication in the sidebar by checking manage_users first
        permission: "view_users",
      },
    ],
  },
  {
    label: "Admin Tools",
    items: [
      {
        to: "/users",
        label: "Users",
        icon: Users,
        permission: "manage_users", // Admin only — full CRUD
      },
      {
        to: "/roles",
        label: "Roles",
        icon: ShieldCheck,
        permission: "manage_roles", // Admin only
      },
      {
        to: "/permissions",
        label: "Permissions",
        icon: Key,
        permission: "manage_permissions", // Admin only
      },
      {
        to: "/audit-logs",
        label: "Audit Logs",
        icon: ClipboardList,
        permission: "manage_users", // Admin only
      },
      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
        permission: "manage_roles", // Admin only
      },
    ],
  },
];

// Flat list kept for backwards compatibility (used nowhere new)
export const menuRoutes: NavRoute[] = menuGroups.flatMap((g) => g.items);
