import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { UsersTable } from "@/components/ui/tables/UsersTable";
import { CreateUserForm } from "@/components/forms/CreateUserForm";
import { usePermissionGuard } from "@/utils/permissionGuard";
import type { UserRecord } from "@/queries/useUsers";

export function UsersPage() {
  const canManage = usePermissionGuard("manage_users");
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);

  const handleEdit = (user: UserRecord) => {
    setEditUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system users</p>
        </div>
        {canManage && (
          <Button
            onClick={() => setOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create User
          </Button>
        )}
      </div>

      <UsersTable onEdit={handleEdit} />

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editUser ? "Edit User" : "Create User"}</DialogTitle>
          </DialogHeader>
          <CreateUserForm user={editUser} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
