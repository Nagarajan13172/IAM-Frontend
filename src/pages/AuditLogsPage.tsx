import { AuditLogsTable } from "@/components/ui/tables/AuditLogsTable";

export function AuditLogsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track all system activity and changes
        </p>
      </div>
      <AuditLogsTable />
    </div>
  );
}
