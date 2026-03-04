import { useState } from "react";
import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { menuGroups } from "./menu-routes";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const { hasPermission } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // If the user has manage_users (Admin), skip the Manager "view_users" group
  // to avoid showing duplicate /users links
  const isAdmin = hasPermission("manage_users");

  // Filter each group's items by permission, then drop empty groups
  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.permission) return true;
        // Suppress view_users item when user already has manage_users
        if (item.permission === "view_users" && isAdmin) return false;
        return hasPermission(item.permission);
      }),
    }))
    .filter((group) => group.items.length > 0);

  const renderNavItem = (to: string, label: string, Icon: React.ElementType) =>
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
        <TooltipContent side="right" className="text-xs font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    ) : (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          cn(
            "flex h-9 w-full items-center gap-2.5 rounded-md px-3",
            "text-[13px] font-medium transition-colors",
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
                "h-[17px] w-[17px] shrink-0 transition-colors",
                isActive ? "text-white" : "text-gray-500"
              )}
            />
            <span>{label}</span>
          </>
        )}
      </NavLink>
    );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-screen bg-[#0f1117] shrink-0",
          "transition-[width] duration-200 ease-in-out",
          "border-r border-white/[0.06]",
          collapsed ? "w-[60px]" : "w-[220px]"
        )}
      >
        {/* ── Logo ─────────────────────────────── */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b border-white/[0.06]",
            collapsed ? "justify-center" : "px-4 gap-3"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-[11px] tracking-wide">
            IAM
          </div>
          {!collapsed && (
            <span className="text-[13px] font-semibold text-white truncate leading-none">
              Identity Manager
            </span>
          )}
        </div>

        {/* ── Navigation ───────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4">
          {visibleGroups.map((group) => (
            <div key={group.label} className="space-y-0.5">
              {/* Group label — hidden when collapsed */}
              {!collapsed && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-600 select-none">
                  {group.label}
                </p>
              )}
              {group.items.map(({ to, label, icon: Icon }) =>
                renderNavItem(to, label, Icon)
              )}
            </div>
          ))}
        </nav>

        {/* ── Footer: user + collapse ───────────── */}
        <div className="shrink-0 border-t border-white/[0.06] px-2 py-3 space-y-1">
          {/* User widget */}
          <NavUser collapsed={collapsed} />

          {/* Collapse / Expand button */}
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
              <TooltipContent side="right" className="text-xs font-medium">
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
