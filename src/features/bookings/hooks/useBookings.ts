import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchBookings } from "../api/bookings";
import type { GetBookingsParams } from "../types";

export const useBookings = (params: GetBookingsParams) => {
    return useQuery({
        queryKey: ["user-bookings", params],
        queryFn: () => fetchBookings(params),
        placeholderData: keepPreviousData,
        refetchOnMount: "always",
    });
};
