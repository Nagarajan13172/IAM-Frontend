import { useAuthStore } from "@/store/authStore";

/**
 * Returns true if the current user has the given permission.
 */
export const checkPermission = (permission: string): boolean => {
  return useAuthStore.getState().hasPermission(permission);
};

/**
 * React hook – use inside components to reactively check permissions.
 */
export const usePermissionGuard = (permission: string): boolean => {
  return useAuthStore((s) => s.hasPermission(permission));
};
