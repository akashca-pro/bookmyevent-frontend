import { CategoryCard } from "./CategoryCard";
import type { Category } from "../../types";
import { Loader2 } from "lucide-react";

interface CategoryListProps {
    data: Category[];
    isLoading: boolean;
    onEdit: (category: Category) => void;
}

export function CategoryList({ data, isLoading, onEdit }: CategoryListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="text-center py-20 text-muted-foreground bg-card/50 rounded-lg border border-dashed border-white/10">
                No categories found. Create one to get started.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((category: Category) => (
                <CategoryCard key={category.id} category={category} onEdit={onEdit} />
            ))}
        </div>
    );
}
