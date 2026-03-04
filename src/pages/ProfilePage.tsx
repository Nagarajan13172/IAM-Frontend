import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Mail, UserCircle, CalendarDays, Key } from "lucide-react";

export function ProfilePage() {
  const { user, permissions } = useAuthStore();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const roleName = user?.role?.name ?? "User";

  const roleColor =
    roleName === "Admin"
      ? "bg-indigo-100 text-indigo-700 border-indigo-200"
      : roleName === "Manager"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-gray-100 text-gray-600 border-gray-200";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your account details and access information
        </p>
      </div>

      {/* ── Profile Card ── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {user?.name ?? "—"}
                </h2>
                <Badge className={roleColor} variant="outline">
                  {roleName}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Account Details ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-indigo-500" />
            Account Details
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Full Name</span>
            <span className="font-medium text-gray-800">{user?.name ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-800">{user?.email ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Role
            </span>
            <Badge className={roleColor} variant="outline">
              {roleName}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Account Status</span>
            <Badge
              className={
                user?.isActive
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }
              variant="outline"
            >
              {user?.isActive ? "Active" : "Disabled"}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Member Since
            </span>
            <span className="font-medium text-gray-800">{joinedDate}</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Permissions ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-500" />
            Your Permissions
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {permissions.length === 0 ? (
            <p className="text-sm text-gray-400">No specific permissions assigned.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {permissions.map((perm) => (
                <Badge
                  key={perm}
                  variant="outline"
                  className="text-xs bg-amber-50 text-amber-700 border-amber-200 font-mono"
                >
                  {perm}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
