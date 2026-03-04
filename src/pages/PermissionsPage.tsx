import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { PermissionsTable } from "@/components/ui/tables/PermissionsTable";
import { CreatePermissionForm } from "@/components/forms/CreatePermissionForm";
import { usePermissionGuard } from "@/utils/permissionGuard";

export function PermissionsPage() {
  const canManage = usePermissionGuard("manage_permissions");
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Define system permission keys
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => setOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Permission
          </Button>
        )}
      </div>

      <PermissionsTable />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
          </DialogHeader>
          <CreatePermissionForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
