import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface BookingFiltersProps {
    search: string;
    status: string;
    sort: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onClearFilters: () => void;
}

export const BookingFilters = ({
    search,
    status,
    sort,
    onSearchChange,
    onStatusChange,
    onSortChange,
    onClearFilters
}: BookingFiltersProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search bookings..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-neon-purple focus-visible:ring-neon-purple/20"
                />
            </div>

            {/* Filters Group */}
            <div className="flex gap-2">
                {/* Status Filter */}
                <Select value={status} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-[140px] bg-black/40 border-white/10 text-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Filter */}
                <Select value={sort} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[160px] bg-black/40 border-white/10 text-white">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={JSON.stringify({ createdAt: -1 })}>Newest First</SelectItem>
                        <SelectItem value={JSON.stringify({ createdAt: 1 })}>Oldest First</SelectItem>
                        <SelectItem value={JSON.stringify({ totalPrice: -1 })}>Price: High to Low</SelectItem>
                        <SelectItem value={JSON.stringify({ totalPrice: 1 })}>Price: Low to High</SelectItem>
                    </SelectContent>
                </Select>

                {(search || status !== "all" || sort !== "-createdAt") && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClearFilters}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                        title="Clear Filters"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};
