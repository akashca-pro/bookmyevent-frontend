import { z } from "zod";

export const GetAvailableServicesQuerySchema = z.object({
    startDate: z.coerce
        .date()
        .refine((d) => !isNaN(d.getTime())),
    endDate: z.coerce
        .date()
        .refine((d) => !isNaN(d.getTime())),
    page: z.coerce.number().int().min(1).default(1),
    category: z.string().optional(),
    minPrice: z.coerce.number().int().optional(),
    maxPrice: z.coerce.number().int().optional(),
    city: z.string().optional(),
    adminId: z.string().optional(),
    limit: z.coerce.number().int(),
    sort: z.string().optional(),
    search: z.string().optional(), // Added for UI search requirement
});

export type GetAvailableServicesQuery = z.infer<typeof GetAvailableServicesQuerySchema>;

export interface GetAvailableServicesResponseDTO {
    id: string; // Added ID for keys
    title: string;
    category: string;
    pricePerDay: number;
    thumbnail: string | null;
    city: string; // Helpful for filtering context
}

export interface PaginationDTO<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
