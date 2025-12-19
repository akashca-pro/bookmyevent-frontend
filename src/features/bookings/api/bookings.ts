import { apiClient } from "@/lib/http";
import type { BookingsResponseDTO, GetBookingsParams, CreateBookingPayload, Booking } from "../types";

const BASE_PATH = "/bookings";

export const fetchBookings = async (params: GetBookingsParams): Promise<BookingsResponseDTO> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.skip) searchParams.set("skip", params.skip!.toString());
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.status && params.status !== "all") searchParams.set("status", params.status);

    return apiClient<BookingsResponseDTO>(`${BASE_PATH}?${searchParams.toString()}`);
};

// Response is a single Booking object
export const reserveBooking = async (serviceId: string, data: CreateBookingPayload): Promise<Booking> => {
    const res = await apiClient<{ success: boolean; data: Booking }>(`${BASE_PATH}/services/${serviceId}/book/reserve`, { data });
    return res.data;
};

export const confirmBooking = async (serviceId: string, bookingId: string): Promise<Booking> => {
    const res = await apiClient<{ success: boolean; data: Booking }>(`${BASE_PATH}/services/${serviceId}/book/${bookingId}/confirm`, { method: 'POST' });
    return res.data;
};

// Keeping this for backward compatibility if needed, but the new flow uses reserveBooking
export const createBooking = async (serviceId: string, data: CreateBookingPayload): Promise<Booking> => {
    return reserveBooking(serviceId, data);
};
