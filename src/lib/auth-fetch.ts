import { authClient } from "@/lib/auth-client";
import { apiFetch, ApiError } from "@/lib/api";

// Gets a fresh JWT from Better Auth and sends it to the Express API.
export async function authFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { data } = await authClient.token();
  if (!data?.token) {
    throw new ApiError("Please sign in again", 401);
  }

  return apiFetch<T>(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${data.token}`,
    },
  });
}