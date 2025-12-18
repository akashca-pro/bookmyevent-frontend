export interface Category {
    id?: string;
    _id?: string; // Support both for now to avoid breaking changes
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationDTO<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface GetCategoryParams {
    page?: number;
    limit?: number;
}
