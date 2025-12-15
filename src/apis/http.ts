

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  details?: any;
  constructor(message: string, details?: any) {
    super(message);
    this.name = "ApiError";
    this.details = details;
  }
}

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
    // Pass 'errors' or 'formattedErrors' or 'details' from backend response
    // User mentioned: formattedErrors = result.error.issues.map(...) returned by ResponseHandler
    // We'll pass the whole error object's relevant array
    throw new ApiError(error.message || 'Request failed', error.errors || error.details || error.formattedErrors);
  }

  return res.json();
}