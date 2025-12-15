import type { GetAvailableServicesResponseDTO } from "../types";
import { ServiceCard } from "./ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceGridProps {
    services: GetAvailableServicesResponseDTO[];
    isLoading: boolean;
}

function ServiceCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full overflow-hidden">
            <div className="aspect-[16/9] bg-muted relative">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="p-4 pt-0 mt-auto">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ServiceGrid({ services, isLoading }: ServiceGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8 text-muted-foreground"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">No services found</h3>
                    <p className="text-muted-foreground max-w-sm mt-1">
                        Try adjusting your filters or search terms to find what you're looking for.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {services.map((service, index) => (
                <ServiceCard key={service.id || index} service={service} index={index} />
            ))}
        </div>
    );
}
