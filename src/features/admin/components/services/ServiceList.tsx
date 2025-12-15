import { AdminServiceCard } from "./AdminServiceCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service, PaginationDTO } from "../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceListProps {
    data?: PaginationDTO<Service>;
    isLoading: boolean;
    onEdit: (service: Service) => void;
    onView: (service: Service) => void;
    page: number;
    setPage: (page: number) => void;
}

export function ServiceList({ data, isLoading, onEdit, onView, page, setPage }: ServiceListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data?.data.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center border rounded-lg bg-muted/20 border-dashed">
                <div className="text-muted-foreground mb-2">No services found</div>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Try adjusting your filters or create a new service.
                </p>
            </div>
        );
    }

    const totalPages = Math.ceil((data.total || 0) / (data.limit || 10));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.data.map((service) => (
                    <AdminServiceCard
                        key={service.id}
                        service={service}
                        onEdit={onEdit}
                        onView={onView}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
