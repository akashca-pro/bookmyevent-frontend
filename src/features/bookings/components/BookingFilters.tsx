import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";

interface BookingFiltersProps {
    status: string;
    sort: string;
    onStatusChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onClearFilters: () => void;
}

export const BookingFilters = ({
    status,
    sort,
    onStatusChange,
    onSortChange,
    onClearFilters
}: BookingFiltersProps) => {
    return (
        <div className="flex w-fit flex-col md:flex-row gap-4 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md items-center shadow-sm">
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

                {(status !== "all" || sort !== JSON.stringify({ createdAt: -1 })) && (
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
