// utils/buildQueryString.ts
export function buildQueryString<T extends Record<string, unknown>>(query: T): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Handle Date
    if (value instanceof Date) {
      params.set(key, value.toISOString());
      return;
    }

    // Handle arrays (if needed later)
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null) {
          params.append(key, String(v));
        }
      });
      return;
    }

    // Primitives (string | number | boolean)
    params.set(key, String(value));
  });

  return params.toString();
}
