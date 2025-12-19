import { useState } from "react";
import { useBookings } from "../hooks/useBookings";
import { BookingCard } from "./BookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookingFilters } from "./BookingFilters";

export const BookingsList = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState(JSON.stringify({ createdAt: -1 }));
    const [search, setSearch] = useState("");

    // Simple debounce via timeout or just pass directly if low traffic. 
    // For now, passing directly. If performance issue, I will refactor.

    const limit = 6;
    const { data, isLoading, isError } = useBookings({
        page,
        limit,
        status: status === "all" ? undefined : status,
        sort,
        search: search || undefined
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1); // Reset page on filter change
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPage(1);
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setSort(JSON.stringify({ createdAt: -1 }));
        setPage(1);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-[400px] w-full rounded-xl bg-white/5" />
                    ))}
                </div>
            );
        }

        if (isError) {
            return <div className="text-red-500">Failed to load bookings.</div>;
        }

        if (!data?.data || data.data.length === 0) {
            return (
                <div className="text-center py-20 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-lg">No bookings found.</p>
                    <p className="text-sm">Explore services to make your first booking!</p>
                </div>
            );
        }

        const { total } = data;
        const totalPages = Math.ceil(total / limit);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.data.map((booking, index) => (
                        <BookingCard key={index} booking={booking} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="text-sm text-gray-400">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="bg-transparent border-white/20 text-white hover:bg-white/10"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={page === i + 1 ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPage(i + 1)}
                                        className={`w-8 h-8 p-0 ${page === i + 1
                                            ? "bg-neon-purple text-white hover:bg-neon-purple/90"
                                            : "bg-transparent border-white/20 text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="bg-transparent border-white/20 text-white hover:bg-white/10"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <BookingFilters
                search={search}
                status={status}
                sort={sort}
                onSearchChange={handleSearchChange}
                onStatusChange={handleStatusChange}
                onSortChange={handleSortChange}
                onClearFilters={clearFilters}
            />
            {renderContent()}
        </div>
    );
};
