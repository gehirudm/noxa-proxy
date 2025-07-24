import { getAuthUser, AuthUser } from "../auth-utils";

// Define a type for functions that accept AuthUser as their first parameter
export type AuthGuardedFunction<T extends any[], R> = (authUser: AuthUser, ...args: T) => Promise<R>;

export function withAuthGuard<T extends any[], R>(
  fn: AuthGuardedFunction<T, R>
): (...args: T) => Promise<{ success: false, error: string } | R> {
  return async function (...args: T) {
    const authUser = await getAuthUser();

    if (!authUser) {
      return { success: false, error: "Authentication required" };
    }

    // Pass the authUser as the first parameter to the wrapped function
    return await fn(authUser, ...args);
  };
}