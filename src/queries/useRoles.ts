import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, routes } from "@/api";
import { toast } from "sonner";

export interface Permission {
  _id: string;
  name: string;
  description?: string;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: string[];
}

export const useRoles = () =>
  useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get<Role[] | { roles: Role[] }>(
        routes.roles.list.path
      );
      const d = res.data;
      return Array.isArray(d) ? d : (d as { roles: Role[] }).roles ?? [];
    },
  });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRolePayload) =>
      api.post(routes.roles.create.path, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create role";
      toast.error(msg);
    },
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRolePayload }) =>
      api.put(routes.roles.update.path(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update role";
      toast.error(msg);
    },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(routes.roles.delete.path(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted");
    },
    onError: () => toast.error("Failed to delete role"),
  });
};
