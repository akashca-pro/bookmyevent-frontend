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


export interface Booking {
    id: string;
    _id?: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    status?: string;
    userId?: string;
    serviceId?: string;
}

export interface UserBooking {
    serviceDetails: {
        _id: string;
        title: string;
        description: string;
        thumbnail : string | null;
    };
    bookingDetails: {
        startDate: string; // API returns strings
        endDate: string;
        totalPrice: number;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
}

export type BookingsResponseDTO = PaginationDTO<UserBooking>;

export const CreateBookingSchema = z.object({
    startDate: z.coerce.date()
        .refine((d) => !isNaN(d.getTime()), "Start date must be a valid date"),
    endDate: z.coerce.date()
        .refine((d) => !isNaN(d.getTime()), "End date must be a valid date"),
});

export type CreateBookingPayload = z.infer<typeof CreateBookingSchema>;
export type BookingResponse = Booking | null;

