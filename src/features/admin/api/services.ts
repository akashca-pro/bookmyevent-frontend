import { apiClient } from "@/apis/http";
import type {
    Service,
    PaginationDTO,
    GetServicesParams,
    ServiceMetrics,
    CreateServiceFuncArgs,
    UpdateServiceFuncArgs
} from "../types";

const BASE_PATH = "/services";

export const fetchServices = async (params: GetServicesParams): Promise<PaginationDTO<Service>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.category) searchParams.set("category", params.category);
    if (params.city) searchParams.set("city", params.city);
    if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
    if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
    if (params.adminId) searchParams.set("adminId", params.adminId);
    if (params.sort) searchParams.set("sort", params.sort);

    return apiClient<PaginationDTO<Service>>(`${BASE_PATH}?${searchParams.toString()}`);
};

export const getService = async (id: string): Promise<Service> => {
    return apiClient<Service>(`${BASE_PATH}/${id}`);
};

export const fetchServiceMetrics = async (): Promise<ServiceMetrics> => {
    return apiClient<ServiceMetrics>(`${BASE_PATH}/metrics`);
};

export const createService = async (data: CreateServiceFuncArgs): Promise<Service> => {
    return apiClient<Service>(`${BASE_PATH}/create`, { // Updated endpoint as per request
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateService = async (id: string, data: UpdateServiceFuncArgs): Promise<Service> => {
    return apiClient<Service>(`${BASE_PATH}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

export const deleteService = async (id: string): Promise<void> => {
    return apiClient<void>(`${BASE_PATH}/${id}`, {
        method: "DELETE",
    });
};

export const uploadThumbnail = async (id: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("thumbnail", file);

    // Initial implementation for file upload might need a specific client method that handles FormData
    // checks existing http client capabilities or uses fetch directly if client implies JSON only
    // Based on http.ts viewed earlier, it sets Content-Type: application/json automatically
    // So we need to override it or use fetch directly for upload.
    // I'll use fetch directly here to avoid issues with the generic client setting JSON headers.

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${BASE_URL}${BASE_PATH}/${id}/thumbnail`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Upload failed');
    }

    return res.json();
};
