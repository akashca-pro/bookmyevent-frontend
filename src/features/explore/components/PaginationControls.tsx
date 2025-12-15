import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
    page: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export function PaginationControls({
    page,
    total,
    limit,
    onPageChange,
}: PaginationControlsProps) {
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-4 mt-8 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
            >
                Previous
            </Button>
            <div className="text-sm font-medium">
                Page {page} of {totalPages}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
            >
                Next
            </Button>
        </div>
    );
}
