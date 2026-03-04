import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoles, useUpdateRole } from "@/queries/useRoles";
import { usePermissions } from "@/queries/usePermissions";
import { usePermissionGuard } from "@/utils/permissionGuard";
import { Loader2, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export function SettingsPage() {
  const canManageRoles = usePermissionGuard("manage_roles");
  const { data: roles } = useRoles();
  const { data: allPermissions } = usePermissions();
  const updateRole = useUpdateRole();

  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [localPerms, setLocalPerms] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);

  const selectedRole = roles?.find((r) => r._id === selectedRoleId);

  const handleRoleChange = (id: string) => {
    setSelectedRoleId(id);
    const role = roles?.find((r) => r._id === id);
    setLocalPerms(
      role?.permissions?.map((p) => (typeof p === "string" ? p : p._id)) ?? []
    );
    setDirty(false);
  };

  const togglePermission = (permId: string) => {
    setLocalPerms((prev) => {
      const next = prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId];
      setDirty(true);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    await updateRole.mutateAsync({
      id: selectedRoleId,
      data: { permissions: localPerms },
    });
    setDirty(false);
    toast.success("Role permissions updated");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">System configuration</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-base">Role Permission Manager</CardTitle>
          </div>
          <CardDescription>
            Select a role and toggle its permissions
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Select Role
            </label>
            <Select onValueChange={handleRoleChange} value={selectedRoleId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choose a role…" />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRole && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Permissions for:
                </span>
                <Badge variant="outline" className="capitalize">
                  {selectedRole.name}
                </Badge>
                <Badge variant="secondary" className="ml-auto">
                  {localPerms.length} / {allPermissions?.length ?? 0} selected
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {allPermissions?.map((perm) => {
                  const checked = localPerms.includes(perm._id);
                  return (
                    <label
                      key={perm._id}
                      className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-colors ${
                        checked
                          ? "border-indigo-300 bg-indigo-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          canManageRoles && togglePermission(perm._id)
                        }
                        disabled={!canManageRoles}
                      />
                      <div>
                        <p className="font-mono text-sm font-medium">
                          {perm.name}
                        </p>
                        {perm.description && (
                          <p className="text-xs text-gray-400">
                            {perm.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {canManageRoles && (
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={!dirty || updateRole.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 min-w-28"
                  >
                    {updateRole.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
