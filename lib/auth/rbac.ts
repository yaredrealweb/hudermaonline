import type { UserRole } from "../types";

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  PATIENT: [
    "view:own-profile",
    "edit:own-profile",
    "view:appointments",
    "book:appointment",
    "view:medical-records",
  ],
  DOCTOR: [
    "view:own-profile",
    "edit:own-profile",
    "view:appointments",
    "manage:appointments",
    "view:patients",
    "create:medical-records",
    "view:schedule",
    "edit:schedule",
  ],
  ADMIN: [
    "view:all-users",
    "manage:users",
    "manage:roles",
    "view:analytics",
    "manage:system",
    "view:audit-logs",
  ],
};

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  userRole: UserRole,
  permissions: string[]
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

export function hasAllPermissions(
  userRole: UserRole,
  permissions: string[]
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

export function canAccessRole(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  // Admins can access all, doctors can access patient data, patients can only access their own
  if (userRole === "ADMIN") return true;
  if (userRole === "DOCTOR" && targetRole === "PATIENT") return true;
  return userRole === targetRole;
}
