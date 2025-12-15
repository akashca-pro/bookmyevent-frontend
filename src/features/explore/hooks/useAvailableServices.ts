import { useQuery } from "@tanstack/react-query";
import { getAvailableServices, type GetAvailableServicesQuery } from "../api/explore";

export function useAvailableServices(query: GetAvailableServicesQuery) {
    return useQuery({
        queryKey: ["available-services", query],
        queryFn: () => getAvailableServices(query),
        placeholderData: (prev) => prev,
    });
}
