import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/categories";

export function useCategoriesOptions() {
    return useQuery({
        queryKey: ["categories-options"],
        queryFn: () => fetchCategories({ page: 1, limit: 100 }), // Fetch up to 100 categories for dropdown
        select: (data) => data.data.map((cat) => ({
            label: cat.name,
            value: cat.slug,
            id: cat.id || "",
        })),
    });
}
