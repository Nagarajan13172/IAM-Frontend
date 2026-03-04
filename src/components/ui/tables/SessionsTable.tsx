import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import { useSessions, useRevokeSession, useRevokeAllSessions } from "@/queries/useSessions";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/formatDate";

export function SessionsTable() {
  const { data: sessions, isLoading } = useSessions();
  const revokeSession = useRevokeSession();
  const revokeAll = useRevokeAllSessions();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => revokeAll.mutate()}
          disabled={revokeAll.isPending || !sessions?.length}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Revoke All Sessions
        </Button>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-10">
                  No active sessions.
                </TableCell>
              </TableRow>
            )}
            {sessions?.map((session) => (
              <TableRow key={session._id}>
                <TableCell className="font-medium text-sm">
                  {session.deviceInfo ?? "Unknown device"}
                </TableCell>
                <TableCell className="font-mono text-sm text-gray-500">
                  {session.ipAddress ?? "—"}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {formatDate(session.createdAt, "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {formatDate(session.lastActivity, "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={session.isActive ? "default" : "secondary"}
                    className={
                      session.isActive
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-gray-100 text-gray-500"
                    }
                  >
                    {session.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => revokeSession.mutate(session._id)}
                    disabled={revokeSession.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
