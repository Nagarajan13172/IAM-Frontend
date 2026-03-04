import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Key,
  MonitorSmartphone,
  ClipboardList,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users, permission: "manage_users" },
  { to: "/roles", label: "Roles", icon: ShieldCheck, permission: "manage_roles" },
  { to: "/permissions", label: "Permissions", icon: Key, permission: "manage_permissions" },
  { to: "/sessions", label: "Sessions", icon: MonitorSmartphone },
  { to: "/audit-logs", label: "Audit Logs", icon: ClipboardList, permission: "manage_users" },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { hasPermission, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const visible = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col h-screen bg-[#0f1117] text-gray-300 shrink-0 transition-[width] duration-200 ease-in-out border-r border-white/[0.06]",
          collapsed ? "w-[64px]" : "w-[220px]"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 items-center border-b border-white/[0.06] px-4 shrink-0",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-[11px] tracking-wide">
            IAM
          </div>
          {!collapsed && (
            <span className="ml-3 font-semibold text-[13px] text-white truncate leading-none">
              Identity Manager
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {visible.map(({ to, label, icon: Icon }) =>
            collapsed ? (
              <Tooltip key={to}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex h-9 w-full items-center justify-center rounded-md transition-colors",
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                      )
                    }
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {label}
                </TooltipContent>
              </Tooltip>
            ) : (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-[17px] w-[17px] shrink-0",
                        isActive ? "text-white" : "text-gray-500"
                      )}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Collapse toggle + Logout */}
        <div className="shrink-0 border-t border-white/[0.06] px-2 py-3 space-y-0.5">
          {/* Logout */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-full items-center justify-center rounded-md text-gray-400 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <LogOut className="h-[17px] w-[17px] shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Logout
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogout}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-[13px] font-medium text-gray-400 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <LogOut className="h-[17px] w-[17px] shrink-0 text-gray-500" />
              <span>Logout</span>
            </button>
          )}

          {/* Collapse button */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(false)}
                  className="flex h-9 w-full items-center justify-center rounded-md text-gray-500 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <PanelLeftOpen className="h-[17px] w-[17px] shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => setCollapsed(true)}
              className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-[13px] font-medium text-gray-500 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <PanelLeftClose className="h-[17px] w-[17px] shrink-0" />
              <span>Collapse</span>
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
