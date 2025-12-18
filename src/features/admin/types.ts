import { z } from "zod";
import { CreateServiceSchema, UpdateServiceSchema } from "./schemas";

export type CreateServiceFuncArgs = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceFuncArgs = z.infer<typeof UpdateServiceSchema>;

export interface ILocation {
    address: string;
    city: string;
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

export interface Service {
    _id?: string; // Mongoose ID
    id?: string; // Frontend alias if needed, or just use _id
    adminId: string;
    title: string;
    category: string;
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

export interface PaginationDTO<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface GetServicesParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    adminId?: string;
    sort?: string;
}

export interface Category {
    _id: string;
    id?: string;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    isArchived: boolean;
    adminId: string;
    createdAt: string;
    updatedAt: string;
}

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
