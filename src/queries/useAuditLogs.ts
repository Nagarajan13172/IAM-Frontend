import { useQuery } from "@tanstack/react-query";
import { api, routes } from "@/api";

export interface AuditLog {
  _id: string;
  userId: { _id: string; name: string; email: string } | null;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface AuditLogFilters {
  action?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const useAuditLogs = (filters?: AuditLogFilters) =>
  useQuery<AuditLog[]>({
    queryKey: ["audit-logs", filters],
    queryFn: async () => {
      const res = await api.get<
        AuditLog[] | { logs: AuditLog[] } | { auditLogs: AuditLog[] }
      >(routes.auditLogs.list.path, { params: filters });
      const d = res.data;
      if (Array.isArray(d)) return d;
      if ("logs" in d) return d.logs ?? [];
      if ("auditLogs" in d) return d.auditLogs ?? [];
      return [];
    },
  });
