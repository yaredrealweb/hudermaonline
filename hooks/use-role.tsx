import { useSession } from "@/lib/auth/auth-client";
import { UserRole } from "@/lib/types";
import { useGetProfile } from "./use-auth-mutation";

export const hasRole = (role: string, module: string): boolean => {
  return role === module;
};

export const usePermissions = () => {
  const { data } = useGetProfile();
  const role = data?.role;
  return {
    checkPermission: (module: UserRole) => {
      return hasRole(role as string, module);
    },
  };
};
