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
import { useCreatePermission } from "@/queries/usePermissions";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Only lowercase letters, numbers and underscores allowed"
    ),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreatePermissionFormProps {
  onSuccess: () => void;
}

export function CreatePermissionForm({ onSuccess }: CreatePermissionFormProps) {
  const createPermission = useCreatePermission();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createPermission.mutateAsync(values);
    form.reset();
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permission Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. manage_users"
                  className="font-mono"
                  {...field}
                />
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
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={createPermission.isPending}
            className="min-w-32"
          >
            {createPermission.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create Permission"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
