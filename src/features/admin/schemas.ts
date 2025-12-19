import { z } from "zod";

// Helper for strict string validation - backend style
const StrictString = (name: string) =>
    z.string()
        .trim()
        .min(1, `${name} cannot be empty`);

export const LocationSchema = z.object({
    address: z.string().min(1, "Address is required"),
    district: z.string().min(1, "District is required"),
    municipality: z.string().min(1, "Municipality is required"),
    pincode: z.string().min(1, "Pincode is required"),
});

export const AvailabilitySchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
});

export const ContactSchema = z.object({
    phone: z.string().min(1, "Phone is required"),
    email: z.string().min(1, "Email is required"),
});

export const CreateServiceSchema = z.object({
    title: StrictString('Title')
        .min(3, 'Title must be atleast 5 characters long') // Note: Backend message says 5, min is 3 in regex/validation? User said min(3) but message 'atleast 5'. Sticking to user code: min(3, 'Title must be atleast 5 characters long').
        .max(100, 'Title must not exceed 100 characters'),

    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(2000, "Description must not exceed 2000 characters"),

    category: StrictString('category'),

    pricePerDay: z.coerce
        .number()
        .int()
        .min(1, "PricePerDay must be at least 1")
        .default(1),

    location: LocationSchema,
    availability: AvailabilitySchema,
    contact: ContactSchema,
}).strict();

export const UpdateServiceSchema = CreateServiceSchema.partial().extend({
    isArchived: z.boolean().optional(),
    isActive: z.boolean().optional(),
    deleteThumbnail: z.boolean().optional(),
});

export const GetServicesQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1, "Page must be at least 1")
        .default(1),
    category: z.string().optional(), // StrictString().optional() implies non-empty if present
    minPrice: z.coerce.number().int().optional(),
    maxPrice: z.coerce.number().int().optional(),
    district: z.string().optional(),
    municipality: z.string().optional(),
    adminId: z.string().optional(),
    limit: z.coerce
        .number()
        .int(),
    sort: z
        .string()
        .trim()
        .optional(),
    // Allow search for frontend convenience if backend permits or ignores extras
    search: z.string().optional(),
});

export const CreateCategorySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, URL-safe, and contain no spaces"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export const UpdateCategorySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    slug: z.string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, URL-safe, and contain no spaces")
        .optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    isActive: z.boolean().optional(),
    isArchived: z.boolean().optional(),
});


