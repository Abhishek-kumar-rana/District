import type { User } from "../api/userApi";


export type Permission = "CREATE" | "DELETE" | "UPDATE";

export function useAuth() {
  const getCurrentUser = (): User | null => {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  };

  const login = (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
   };

  const getPermissions = (): Permission[] => {
    const user = getCurrentUser();

    switch (user?.role) {
      case "superadmin":
        return ["CREATE", "DELETE", "UPDATE"];

      case "admin":
        return ["CREATE", "UPDATE"];

      default:
        return [];
    }
  };

  const hasPermission = (permission: Permission) => {
    return getPermissions().includes(permission);
  };

   

   

  return {
    login,
    logout,
    getCurrentUser,
    getPermissions,
    hasPermission,
     
  };
}