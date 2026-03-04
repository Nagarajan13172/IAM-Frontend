import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateRole, useUpdateRole } from "@/queries/useRoles";
import type { Role } from "@/queries/useRoles";
import { usePermissions } from "@/queries/usePermissions";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

interface CreateRoleFormProps {
  role?: Role | null;
  onSuccess: () => void;
}

export function CreateRoleForm({ role, onSuccess }: CreateRoleFormProps) {
  const isEdit = !!role;
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const { data: allPermissions } = usePermissions();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role?.name ?? "",
      description: role?.description ?? "",
      permissions: role?.permissions?.map((p) =>
        typeof p === "string" ? p : p._id
      ) ?? [],
    },
  });

  useEffect(() => {
    form.reset({
      name: role?.name ?? "",
      description: role?.description ?? "",
      permissions:
        role?.permissions?.map((p) => (typeof p === "string" ? p : p._id)) ??
        [],
    });
  }, [role, form]);

  const onSubmit = async (values: FormValues) => {
    if (isEdit && role) {
      await updateRole.mutateAsync({ id: role._id, data: values });
    } else {
      await createRole.mutateAsync(values);
    }
    onSuccess();
  };

  const isPending = createRole.isPending || updateRole.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. admin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Optional description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="permissions"
          render={() => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <ScrollArea className="h-48 rounded border p-3">
                <div className="space-y-2">
                  {allPermissions?.map((perm) => (
                    <FormField
                      key={perm._id}
                      control={form.control}
                      name="permissions"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value.includes(perm._id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, perm._id]);
                                } else {
                                  field.onChange(
                                    field.value.filter((v) => v !== perm._id)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <span className="font-mono text-sm">{perm.name}</span>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending} className="min-w-24">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Role"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
