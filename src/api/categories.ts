import { apiClient } from "@/lib/http";
import type { ApiResponse } from "@/types/apiRes.type";
import type { Category, PaginationDTO, GetCategoryParams } from "../types/category";

const BASE_PATH = "/categories";

export const fetchCategories = async (params?: GetCategoryParams): Promise<PaginationDTO<Category>> => {
    const queryString = new URLSearchParams();
    if (params?.page) queryString.append("page", params.page.toString());
    if (params?.limit) queryString.append("limit", params.limit.toString());

    const res = await apiClient<ApiResponse<PaginationDTO<Category>>>(`${BASE_PATH}?${queryString.toString()}`);
    return res.data;
};
