import { z } from "zod";
import { CreateServiceSchema, UpdateServiceSchema } from "./schemas";

export type CreateServiceFuncArgs = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceFuncArgs = z.infer<typeof UpdateServiceSchema>;

export interface ILocation {
    address: string;
    district: string;
    municipality: string;
    pincode: string;
}

export interface IAvailability {
    from: Date | string; // Date string from API, Date object in form
    to: Date | string;
}

export interface IContact {
    phone: string;
    email: string;
}

export interface ICategory {
    id: string
    name: string;
    slug: string;
    description?: string;
}

export interface Service {
    id?: string;
    adminId: string;
    title: string;
    category: ICategory;
    pricePerDay: number;
    description: string;
    thumbnail: string | null;
    location: ILocation;
    availability: IAvailability;
    contact: IContact;
    isArchived: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceMetrics {
    totalServices: number;
    totalBookings: number;
    todaysBookings: number;
    totalRevenue: number;
}

export interface GetServicesParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    district?: string;
    municipality?: string;
    minPrice?: number;
    maxPrice?: number;
    adminId?: string;
    sort?: string;
}

// Re-export shared types
export type { Category, PaginationDTO, GetCategoryParams } from "@/types/category";

export interface CreateCategoryDTO {
    name: string;
    slug: string;
    description: string;
}

export interface UpdateCategoryDTO {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    isArchived?: boolean;
}

export interface GetBookingsByServiceResponseDTO {
    user: {
        name: string;
        email: string;
        avatar: string | null;
    };
    bookingDetails: {
        startDate: Date | string;
        endDate: Date | string;
        totalPrice: number;
        status: string;
        createdAt: Date | string;
        updatedAt: Date | string;
    };
}
