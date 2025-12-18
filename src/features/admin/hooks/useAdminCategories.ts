import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../api/categories";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../types";
import { toast } from "sonner";

export function useAdminCategories() {
    const queryClient = useQueryClient();

    const categoriesQuery = useQuery({
        queryKey: ["admin-categories"],
        queryFn: fetchCategories,
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateCategoryDTO) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Category created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create category");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDTO }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Category updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update category");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Category deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete category");
        },
    });

    return {
        categories: categoriesQuery.data || [],
        isLoading: categoriesQuery.isLoading,
        error: categoriesQuery.error,
        createCategory: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateCategory: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteCategory: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
