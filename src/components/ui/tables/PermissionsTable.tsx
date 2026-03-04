import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { usePermissions, useDeletePermission } from "@/queries/usePermissions";
import type { Permission } from "@/queries/usePermissions";
import { usePermissionGuard } from "@/utils/permissionGuard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/formatDate";

export function PermissionsTable() {
  const { data: permissions, isLoading } = usePermissions();
  const deletePermission = useDeletePermission();
  const canManage = usePermissionGuard("manage_permissions");
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);

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
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              {canManage && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400 py-10">
                  No permissions found.
                </TableCell>
              </TableRow>
            )}
            {permissions?.map((perm) => (
              <TableRow key={perm._id}>
                <TableCell className="font-mono text-sm font-medium">
                  {perm.name}
                </TableCell>
                <TableCell className="text-gray-500">
                  {perm.description ?? "—"}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {formatDate(perm.createdAt, "MMM d, yyyy")}
                </TableCell>
                {canManage && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteTarget(perm)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete permission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the permission{" "}
              <span className="font-mono font-medium">{deleteTarget?.name}</span>.
              Roles using this permission will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  deletePermission.mutate(deleteTarget._id);
                  setDeleteTarget(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
