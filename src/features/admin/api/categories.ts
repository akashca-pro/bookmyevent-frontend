import { apiClient } from "@/lib/http";
import type { ApiResponse } from "@/types/apiRes.type";
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from "../types";

const BASE_PATH = "/categories";

export const fetchCategories = async (): Promise<Category[]> => {
    const res = await apiClient<ApiResponse<Category[]>>(`${BASE_PATH}`);
    return res.data;
};

export const createCategory = async (data: CreateCategoryDTO): Promise<Category> => {
    const res = await apiClient<ApiResponse<Category>>(`${BASE_PATH}`, {
        method: "POST",
        data,
    });
    return res.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    const res = await apiClient<ApiResponse<Category>>(`${BASE_PATH}/${id}`, {
        method: "PATCH",
        data,
    });
    return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await apiClient(`${BASE_PATH}/${id}`, {
        method: "DELETE",
    });
};
