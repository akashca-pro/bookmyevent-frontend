
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}