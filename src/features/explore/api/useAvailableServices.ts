import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { GetAvailableServicesQuery, GetAvailableServicesResponseDTO, PaginationDTO } from "../types";

// Mock API function - in a real app this would be in src/apis
// But for this task I will implement the fetcher here or assume a global fetcher exists.
// Given "API client usage" expectation, I'll assume a standard fetch or axios.
// I'll stick to native fetch for zero-dep simplicity or use a hypothetical client.
// The user said "API client usage" as an output expectation.
// I will simulate a fetch to an endpoint like `/api/services`

const fetchServices = async (params: GetAvailableServicesQuery): Promise<PaginationDTO<GetAvailableServicesResponseDTO>> => {
    const searchParams = new URLSearchParams();

    if (params.startDate) searchParams.set("startDate", params.startDate.toISOString());
    if (params.endDate) searchParams.set("endDate", params.endDate.toISOString());
    searchParams.set("page", params.page.toString());
    searchParams.set("limit", params.limit.toString());

    if (params.category) searchParams.set("category", params.category);
    if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
    if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
    if (params.city) searchParams.set("city", params.city);
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.adminId) searchParams.set("adminId", params.adminId);

    // Replace with actual API base URL
    const response = await fetch(`/api/services/available?${searchParams.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to fetch services");
    }

    return response.json();
};

export const useAvailableServices = (params: GetAvailableServicesQuery) => {
    return useQuery({
        queryKey: ["available-services", params],
        queryFn: () => fetchServices(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
