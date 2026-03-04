import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, Key, MonitorSmartphone, UserCircle } from "lucide-react";
import { useUsers } from "@/queries/useUsers";
import { useRoles } from "@/queries/useRoles";
import { usePermissions } from "@/queries/usePermissions";
import { useSessions } from "@/queries/useSessions";
import { useAuditLogs } from "@/queries/useAuditLogs";
import { AuditLogsTable } from "@/components/ui/tables/AuditLogsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  isLoading: boolean;
}

function StatCard({ title, value, icon, color, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-12 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { user, hasPermission } = useAuthStore();

  const canManageUsers = hasPermission("manage_users");
  const canViewUsers = hasPermission("view_users");
  const canManageRoles = hasPermission("manage_roles");
  const canManagePermissions = hasPermission("manage_permissions");

  // Only fetch data the current role is allowed to see
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: roles, isLoading: loadingRoles } = useRoles();
  const { data: permissions, isLoading: loadingPerms } = usePermissions();
  const { data: sessions, isLoading: loadingSessions } = useSessions();
  const { data: logs } = useAuditLogs({ limit: 10 });

  const activeSessions = sessions?.filter((s) => s.isActive).length;
  const roleName = user?.role?.name ?? "User";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Identity & Access Management overview
          </p>
        </div>
        <Badge
          className={
            roleName === "Admin"
              ? "bg-indigo-100 text-indigo-700 border-indigo-200"
              : roleName === "Manager"
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }
          variant="outline"
        >
          {roleName}
        </Badge>
      </div>

      {/* ── Welcome card for User role ── */}
      {!canManageUsers && !canViewUsers && (
        <Card className="border-indigo-100 bg-indigo-50/40">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100">
              <UserCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                Welcome, {user?.name ?? "User"}!
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                You are logged in as <span className="font-medium">{roleName}</span>. You can view your sessions and manage your profile.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Stats — shown based on role ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Active Sessions — visible to everyone */}
        <StatCard
          title="My Active Sessions"
          value={activeSessions}
          isLoading={loadingSessions}
          icon={<MonitorSmartphone className="h-5 w-5 text-sky-600" />}
          color="bg-sky-50"
        />

        {/* Total Users — visible to Manager + Admin (view_users or manage_users) */}
        {(canViewUsers || canManageUsers) && (
          <StatCard
            title="Total Users"
            value={users?.length}
            isLoading={loadingUsers}
            icon={<Users className="h-5 w-5 text-indigo-600" />}
            color="bg-indigo-50"
          />
        )}

        {/* Roles — Admin only */}
        {canManageRoles && (
          <StatCard
            title="Total Roles"
            value={roles?.length}
            isLoading={loadingRoles}
            icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
            color="bg-emerald-50"
          />
        )}

        {/* Permissions — Admin only */}
        {canManagePermissions && (
          <StatCard
            title="Permissions"
            value={permissions?.length}
            isLoading={loadingPerms}
            icon={<Key className="h-5 w-5 text-amber-600" />}
            color="bg-amber-50"
          />
        )}
      </div>

      {/* ── Recent Audit Logs — Admin only ── */}
      {canManageUsers && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {logs && logs.length > 0 ? (
              <AuditLogsTable />
            ) : (
              <p className="text-sm text-gray-400 text-center py-10">
                No recent activity.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
