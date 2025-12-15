import { z } from "zod";
import type { PaginationDTO } from "../../admin/types";

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

export interface Booking {
    bookingDetails: BookingDetails;
    serviceDetails: ServiceDetails;
}

export type BookingsResponseDTO = PaginationDTO<Booking>;
