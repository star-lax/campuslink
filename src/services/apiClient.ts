export interface ApiResponse<T> { success: boolean; data: T; message: string }

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:4000/api';

export async function apiClient<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  const payload = await response.json() as ApiResponse<T>;
  if (!response.ok || !payload.success) throw new Error(payload.message || 'Request failed');
  return payload;
}
