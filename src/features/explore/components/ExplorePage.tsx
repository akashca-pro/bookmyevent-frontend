import { useSearchParams } from "react-router-dom";
import { ServiceFilters } from "./ServiceFilters";
import { ServiceGrid } from "./ServiceGrid";
import { PaginationControls } from "./PaginationControls";
import type { GetAvailableServicesQuery } from "../api/explore";
import { useMemo } from "react";
import { useAvailableServices } from "../hooks/useAvailableServices";

export default function ExplorePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse filters from URL
    const filters = useMemo<GetAvailableServicesQuery>(() => ({
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        startDate: searchParams.get("startDate")
            ? new Date(searchParams.get("startDate")!)
            : new Date(),
        endDate: searchParams.get("endDate")
            ? new Date(searchParams.get("endDate")!)
            : new Date(new Date().setDate(new Date().getDate() + 7)),
        category: searchParams.get("category") || undefined,
        city: searchParams.get("city") || undefined,
        minPrice: searchParams.get("minPrice")
            ? Number(searchParams.get("minPrice"))
            : undefined,
        maxPrice: searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : undefined,
        sort: searchParams.get("sort") || undefined,
    }), [searchParams]);


    const {
        data,
        isLoading,
        error,
    } = useAvailableServices(filters);


    const handleFilterChange = (newFilters: Partial<GetAvailableServicesQuery>) => {
        const newParams = new URLSearchParams(searchParams);

        // Reset page to 1 on filter change
        newParams.set("page", "1");

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                newParams.delete(key);
            } else if (value instanceof Date) {
                if (!isNaN(value.getTime())) {
                    newParams.set(key, value.toISOString());
                }
            } else {
                newParams.set(key, String(value));
            }
        });

        setSearchParams(newParams);
    };

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", page.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleClearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    return (
        <div className="container mx-auto px-4 pt-28 pb-8 min-h-screen">
            <div className="flex flex-col space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Explore Services</h1>
                    <p className="text-muted-foreground mt-2">
                        Discover and book the best services for your event.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Filters */}
                    <aside className="w-full lg:w-1/4 shrink-0">
                        <div className="sticky top-4">
                            <ServiceFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                    </aside>

                    {/* Right Content - Grid */}
                    <main className="flex-1">
                        {error ? (
                            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-center">
                                Something went wrong loading services. Please try again.
                            </div>
                        ) : (
                            <>
                                <ServiceGrid
                                    services={data?.data || []}
                                    isLoading={isLoading}
                                />
                                {!isLoading && data && (
                                    <PaginationControls
                                        page={data.page}
                                        total={data.total}
                                        limit={data.limit}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
