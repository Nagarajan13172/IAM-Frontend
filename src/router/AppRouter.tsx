import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { UsersPage } from "@/pages/UsersPage";
import { RolesPage } from "@/pages/RolesPage";
import { PermissionsPage } from "@/pages/PermissionsPage";
import { SessionsPage } from "@/pages/SessionsPage";
import { AuditLogsPage } from "@/pages/AuditLogsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ProfilePage } from "@/pages/ProfilePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected – authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Manager — can view users (read-only) */}
            <Route element={<ProtectedRoute permission="view_users" />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>

            {/* Admin — full user management + audit logs */}
            <Route element={<ProtectedRoute permission="manage_users" />}>
              <Route path="/audit-logs" element={<AuditLogsPage />} />
            </Route>

            {/* Admin — role + settings management */}
            <Route element={<ProtectedRoute permission="manage_roles" />}>
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Admin — permission management */}
            <Route element={<ProtectedRoute permission="manage_permissions" />}>
              <Route path="/permissions" element={<PermissionsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
