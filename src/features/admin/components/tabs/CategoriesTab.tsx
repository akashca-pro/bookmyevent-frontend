import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryList } from "../categories/CategoryList";
import { CreateCategoryModal } from "../modals/CreateCategoryModal";
import { EditCategoryModal } from "../modals/EditCategoryModal";
import { PaginationControls } from "../PaginationControls";
import { useAdminCategories } from "../../hooks/useAdminCategories";
import type { Category } from "../../types";

export function CategoriesTab() {
    const { categories, isLoading, page, total, limit, setPage } = useAdminCategories();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Category Management</h2>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                </Button>
            </div>

            <CategoryList
                data={categories}
                isLoading={isLoading}
                onEdit={handleEdit}
            />

            <PaginationControls
                page={page}
                total={total}
                limit={limit}
                onPageChange={setPage}
            />

            <CreateCategoryModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
            />

            {selectedCategory && (
                <EditCategoryModal
                    category={selectedCategory}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                />
            )}
        </div>
    );
}
