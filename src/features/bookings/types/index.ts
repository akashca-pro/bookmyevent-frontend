import { z } from "zod";
import type { PaginationDTO } from "@/types/category";

export const GetBookingsQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1, "Page must be at least 1")
        .default(1),
    limit: z.coerce
        .number()
        .int(),
    skip: z.coerce
        .number()
        .int()
        .optional(),
    sort: z
        .string()
        .trim()
        .optional(),
});

export type GetBookingsParams = z.infer<typeof GetBookingsQuerySchema>;

export interface BookingDetails {
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceDetails {
    title: string;
    description: string;
    thumbnail: string | null;
}

export type BookingsResponseDTO = PaginationDTO<Booking>;

export interface Booking {
    id: string; // or _id
    _id?: string;
    userId: string;
    serviceId: string;
    startDate: string; // Date strings from API
    endDate: string;
    totalPrice: number;
    status: string; // or enum if known
    createdAt: string;
    updatedAt: string;
    // Including nested details if API returns them populated, otherwise we might need them separate
    // The user's snippet didn't show populated fields, but ConfirmationPage needs them.
    // However, ConfirmationPage takes `service` from previous page state, so we might only need booking details here.
    // Let's assume the response is exactly what user pasted.
}

export interface CreateBookingPayload {
    startDate: Date;
    endDate: Date;
}
