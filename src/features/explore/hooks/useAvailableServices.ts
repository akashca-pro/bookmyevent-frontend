import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { GetAvailableServicesQuery,  } from "../types";
import { getAvailableServices } from "../api/explore";

export const useAvailableServices = (params: GetAvailableServicesQuery) => {
    return useQuery({
        queryKey: ["available-services", params],
        queryFn: () => getAvailableServices(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });
};
