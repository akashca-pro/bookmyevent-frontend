import { apiClient } from "@/lib/http";
import type { ApiResponse } from "@/types/apiRes.type";
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
    if (params.district) searchParams.set("district", params.district);
    if (params.municipality) searchParams.set("municipality", params.municipality);
    if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
    if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
    if (params.adminId) searchParams.set("adminId", params.adminId);
    if (params.sort) searchParams.set("sort", params.sort);

    const res = await apiClient<ApiResponse<PaginationDTO<Service>>>(`${BASE_PATH}?${searchParams.toString()}`);
    return res.data;
};

export const getService = async (id: string): Promise<Service> => {
    return apiClient<Service>(`${BASE_PATH}/${id}`);
};

export const fetchServiceMetrics = async (): Promise<ServiceMetrics> => {
    return apiClient<ServiceMetrics>(`${BASE_PATH}/metrics`);
};

export const createService = async (data: CreateServiceFuncArgs): Promise<Service> => {
    return apiClient<Service>(`${BASE_PATH}/create`, {
        data,
    });
};

export const updateService = async (id: string, data: UpdateServiceFuncArgs & { thumbnail?: File }): Promise<Service> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (value instanceof File) {
            // File explicitly passed in data
            formData.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
            // Unpack nested objects like location and contact
            Object.entries(value).forEach(([subKey, subValue]) => {
                if (subValue !== undefined && subValue !== null) {
                    formData.append(`${key}[${subKey}]`, String(subValue));
                }
            });
        } else if (value !== undefined && value !== null) {
            formData.append(key, value as any);
        }
    });

    // Handle separate thumbnail if present
    if (data.thumbnail && data.thumbnail instanceof File) {
        // Already appended by loop if it was in 'data', but safety check
        // if user passed it as separate arg (types intersection), we deal with it
    }

    return apiClient<Service>(`${BASE_PATH}/${id}/update`, {
        method: "PATCH",
        body: formData,
    });
};

export const deleteService = async (id: string): Promise<void> => {
    return apiClient<void>(`${BASE_PATH}/${id}`, {
        method: "DELETE",
    });
};
