import { getAuthUser, AuthUser } from "../auth-utils";

// Define a type for functions that accept AuthUser as their first parameter
export type AdminGuardedFunction<T extends any[], R> = (authUser: AuthUser, ...args: T) => Promise<R>;

export function withAdminGuard<T extends any[], R>(
  fn: AdminGuardedFunction<T, R>
): (...args: T) => Promise<{ success: false, error: string } | R> {
  return async function (...args: T) {
    const authUser = await getAuthUser();

    if (!authUser) {
      return { success: false, error: "Authentication required" };
    }

    if (authUser.role !== "admin") {
      return { success: false, error: "Admin privileges required" };
    }

    // Pass the authUser as the first parameter to the wrapped function
    return await fn(authUser, ...args);
  };
}