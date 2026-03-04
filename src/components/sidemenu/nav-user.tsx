import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LogOut, Settings, ChevronsUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavUserProps {
  collapsed: boolean;
}

export function NavUser({ collapsed }: NavUserProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const trigger = collapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="flex w-full items-center justify-center rounded-md p-1.5 hover:bg-white/[0.06] transition-colors">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-indigo-600 text-white text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {user?.name ?? "Account"}
      </TooltipContent>
    </Tooltip>
  ) : (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5",
        "hover:bg-white/[0.06] transition-colors group"
      )}
    >
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback className="bg-indigo-600 text-white text-[10px] font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left min-w-0">
        <p className="text-[12px] font-semibold text-white leading-tight truncate">
          {user?.name ?? "User"}
        </p>
        <p className="text-[11px] text-gray-500 leading-tight truncate">
          {user?.email ?? ""}
        </p>
      </div>
      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-gray-500 group-hover:text-gray-300 transition-colors" />
    </button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={collapsed ? "right" : "top"}
        align={collapsed ? "start" : "end"}
        className="w-56 mb-1"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-indigo-600 text-white text-[11px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold truncate">
                {user?.name}
              </span>
              <span className="text-[11px] text-gray-500 truncate font-normal">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        {user?.role?.name && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <Badge
                variant="secondary"
                className="text-[11px] capitalize font-medium"
              >
                {user.role.name}
              </Badge>
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
