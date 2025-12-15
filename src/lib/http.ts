const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiClientOptions extends RequestInit {
    data?: any;
}

export async function apiClient<T>(endpoint: string, { data, ...customConfig }: ApiClientOptions = {}): Promise<T> {
    const config: RequestInit = {
        method: data ? 'POST' : 'GET',
        body: data ? JSON.stringify(data) : undefined,
        headers: {
            'Content-Type': data ? 'application/json' : undefined,
            ...customConfig.headers,
        } as HeadersInit,
        ...customConfig,
        credentials: 'include',
    };

    if (config.body && customConfig.method && customConfig.method !== 'POST') {

        config.method = customConfig.method;
    }


    if (config.headers) {
        const headers = config.headers as Record<string, string | undefined>;
        Object.keys(headers).forEach(key => headers[key] === undefined && delete headers[key]);
    }


    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401) {

    }

    const responseData = await response.json().catch(() => ({}));

    if (response.ok) {
        return responseData as T;
    } else {
        const errorMessage = responseData?.message || response.statusText;
        return Promise.reject({ message: errorMessage, status: response.status, ...responseData });
    }
}
