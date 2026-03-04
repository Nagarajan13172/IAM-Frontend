import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, routes } from "@/api";
import { toast } from "sonner";

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: { _id: string; name: string; permissions: string[] } | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string;
}

export const useUsers = () =>
  useQuery<UserRecord[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get<UserRecord[] | { users: UserRecord[] }>(
        routes.users.list.path
      );
      const d = res.data;
      return Array.isArray(d) ? d : (d as { users: UserRecord[] }).users ?? [];
    },
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPayload) =>
      api.post(routes.users.create.path, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create user";
      toast.error(msg);
    },
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      api.put(routes.users.update.path(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update user";
      toast.error(msg);
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(routes.users.delete.path(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });
};

export const useDisableUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(routes.users.disable.path(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User disabled");
    },
    onError: () => toast.error("Failed to disable user"),
  });
};

export const useEnableUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(routes.users.enable.path(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User enabled");
    },
    onError: () => toast.error("Failed to enable user"),
  });
};
