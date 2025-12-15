import { apiClient } from "@/apis/http";
import type { BookingsResponseDTO, GetBookingsParams } from "../types";

const BASE_PATH = "/bookings";

export const fetchBookings = async (params: GetBookingsParams): Promise<BookingsResponseDTO> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.skip) searchParams.set("skip", params.skip!.toString());
    if (params.sort) searchParams.set("sort", params.sort);

    return apiClient<BookingsResponseDTO>(`${BASE_PATH}?${searchParams.toString()}`);
};
