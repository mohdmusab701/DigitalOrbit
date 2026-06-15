/**
 * Authentication and authorization utility functions.
 */

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export function getSessionUser(): SessionPayload | null {
  // Placeholder for session fetching logic (e.g. cookies validation)
  return null;
}

export function isAuthenticated(): boolean {
  return getSessionUser() !== null;
}

export function isAdmin(): boolean {
  const user = getSessionUser();
  return user?.role === "admin";
}
