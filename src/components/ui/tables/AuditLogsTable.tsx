import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuditLogs } from "@/queries/useAuditLogs";
import type { AuditLogFilters } from "@/queries/useAuditLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/formatDate";
import { Search } from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-indigo-100 text-indigo-700",
  logout: "bg-gray-100 text-gray-600",
  disable: "bg-amber-100 text-amber-700",
  enable: "bg-teal-100 text-teal-700",
};

const actionClass = (action: string) => {
  const key = Object.keys(ACTION_COLORS).find((k) =>
    action.toLowerCase().includes(k)
  );
  return key ? ACTION_COLORS[key] : "bg-gray-100 text-gray-600";
};

export function AuditLogsTable() {
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const { data: logs, isLoading } = useAuditLogs(filters);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter by action…"
            className="pl-8 h-9 w-44"
            value={filters.action ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, action: e.target.value || undefined }))
            }
          />
        </div>
        <Input
          type="date"
          className="h-9 w-40"
          value={filters.startDate ?? ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, startDate: e.target.value || undefined }))
          }
        />
        <Input
          type="date"
          className="h-9 w-40"
          value={filters.endDate ?? ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, endDate: e.target.value || undefined }))
          }
        />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-10">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
            {logs?.map((log) => (
              <TableRow key={log._id}>
                <TableCell className="text-gray-500 text-sm whitespace-nowrap">
                  {formatDate(log.timestamp, "MMM d, yyyy HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {log.userId ? (
                    <div>
                      <p className="text-sm font-medium">{log.userId.name}</p>
                      <p className="text-xs text-gray-400">{log.userId.email}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">System</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${actionClass(log.action)}`}
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {log.resource}
                  {log.resourceId && (
                    <span className="ml-1 text-xs text-gray-400 font-mono">
                      ({log.resourceId.slice(-6)})
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-500">
                  {log.ipAddress ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
