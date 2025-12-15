import { apiClient } from "@/lib/http";
import type { PaginationDTO } from "../types";
import { buildQueryString } from "@/utils/buildQueryString";

const preUrl = "/services";

export interface GetAvailableServicesQuery {
    startDate: Date | string;
    endDate: Date | string;
    limit: number;

    page?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    adminId?: string;
    sort?: string;
}

export interface GetAvailableServicesResponseDTO {
    id: string;
    title: string;
    category: string;
    pricePerDay: number;
    thumbnailUrl: string | null;
    city: string;
}

export async function getAvailableServices(query: GetAvailableServicesQuery) {
    const queryString = buildQueryString({
        ...query,
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
    });

    const res = await apiClient<{
        success: boolean;
        message: string;
        data: PaginationDTO<GetAvailableServicesResponseDTO>;
    }>(`${preUrl}/available?${queryString}`, {
        method: "GET",
    });

    return res.data;
}
