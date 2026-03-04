import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { RolesTable } from "@/components/ui/tables/RolesTable";
import { CreateRoleForm } from "@/components/forms/CreateRoleForm";
import { usePermissionGuard } from "@/utils/permissionGuard";
import type { Role } from "@/queries/useRoles";

export function RolesPage() {
  const canManage = usePermissionGuard("manage_roles");
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditRole(role);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRole(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage roles and their permissions
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => setOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        )}
      </div>

      <RolesTable onEdit={handleEdit} />

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editRole ? "Edit Role" : "Create Role"}</DialogTitle>
          </DialogHeader>
          <CreateRoleForm role={editRole} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
