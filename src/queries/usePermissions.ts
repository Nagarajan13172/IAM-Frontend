import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, routes } from "@/api";
import { toast } from "sonner";

export interface Permission {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreatePermissionPayload {
  name: string;
  description?: string;
}

export const usePermissions = () =>
  useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await api.get<Permission[] | { permissions: Permission[] }>(
        routes.permissions.list.path
      );
      const d = res.data;
      return Array.isArray(d)
        ? d
        : (d as { permissions: Permission[] }).permissions ?? [];
    },
  });

export const useCreatePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePermissionPayload) =>
      api.post(routes.permissions.create.path, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission created successfully");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create permission";
      toast.error(msg);
    },
  });
};

export const useDeletePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(routes.permissions.delete.path(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission deleted");
    },
    onError: () => toast.error("Failed to delete permission"),
  });
};
