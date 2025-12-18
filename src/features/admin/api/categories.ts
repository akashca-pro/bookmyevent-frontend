import { apiClient } from "@/lib/http";
import type { ApiResponse } from "@/types/apiRes.type";
import type { Category, CreateCategoryDTO, UpdateCategoryDTO, PaginationDTO, GetCategoryParams } from "../types";

const BASE_PATH = "/categories";

export const fetchCategories = async (params?: GetCategoryParams): Promise<PaginationDTO<Category>> => {
    const queryString = new URLSearchParams();
    if (params?.page) queryString.append("page", params.page.toString());
    if (params?.limit) queryString.append("limit", params.limit.toString());

    const res = await apiClient<ApiResponse<PaginationDTO<Category>>>(`${BASE_PATH}?${queryString.toString()}`);
    return res.data;
};

export const createCategory = async (data: CreateCategoryDTO): Promise<Category> => {
    const res = await apiClient<ApiResponse<Category>>(`${BASE_PATH}/create`, {
        method: "POST",
        data,
    });
    return res.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    const res = await apiClient<ApiResponse<Category>>(`${BASE_PATH}/${id}/update`, {
        method: "PATCH",
        data,
    });
    return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await apiClient(`${BASE_PATH}/${id}/delete`, {
        method: "DELETE",
    });
};
