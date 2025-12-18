import { apiClient } from "@/lib/http";
import type { BookingsResponseDTO, GetBookingsParams, CreateBookingPayload, Booking } from "../types";

const BASE_PATH = "/bookings";

export const fetchBookings = async (params: GetBookingsParams): Promise<BookingsResponseDTO> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.skip) searchParams.set("skip", params.skip!.toString());
    if (params.sort) searchParams.set("sort", params.sort);

    return apiClient<BookingsResponseDTO>(`${BASE_PATH}?${searchParams.toString()}`);
};

// Response is a single Booking object
export const createBooking = async (serviceId: string, data: CreateBookingPayload): Promise<Booking> => {
    return apiClient(`${BASE_PATH}/services/${serviceId}/create`, { data });
};

export const confirmBooking = async (bookingId: string): Promise<Booking> => {
    return apiClient(`${BASE_PATH}/${bookingId}/confirm`, { method: 'PUT' });
};
