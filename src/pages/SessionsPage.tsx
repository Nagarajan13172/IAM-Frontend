import { SessionsTable } from "@/components/ui/tables/SessionsTable";

export function SessionsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and manage active user sessions
        </p>
      </div>
      <SessionsTable />
    </div>
  );
}
