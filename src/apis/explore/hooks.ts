import type { GetAvailableServicesQuery } from "@/features/explore/types";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAvailableServices } from "./explore.api";


export function useGetAvailableServicesQuery(query: GetAvailableServicesQuery) {
  return useQuery({
    queryKey: ['available-services', query],
    queryFn: () => getAvailableServices(query),
    placeholderData: keepPreviousData,
  });
}