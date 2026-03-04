import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, routes } from "@/api";
import { toast } from "sonner";

export interface Session {
  _id: string;
  userId: string;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: string;
  lastActivity?: string;
  isActive: boolean;
}

export const useSessions = () =>
  useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await api.get<Session[] | { sessions: Session[] }>(
        routes.sessions.list.path
      );
      const d = res.data;
      return Array.isArray(d)
        ? d
        : (d as { sessions: Session[] }).sessions ?? [];
    },
  });

export const useRevokeSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(routes.sessions.revoke.path(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session revoked");
    },
    onError: () => toast.error("Failed to revoke session"),
  });
};

export const useRevokeAllSessions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(routes.sessions.revokeAll.path),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("All sessions revoked");
    },
    onError: () => toast.error("Failed to revoke all sessions"),
  });
};
