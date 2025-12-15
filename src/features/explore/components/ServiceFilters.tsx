import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GetAvailableServicesQuery } from "../api/explore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ServiceFiltersProps {
    filters: Partial<GetAvailableServicesQuery>;
    onFilterChange: (newFilters: Partial<GetAvailableServicesQuery>) => void;
    onClearFilters: () => void;
}

const CATEGORIES = [
    "Venue",
    "Hotel",
    "Caterer",
    "Photographer",
    "DJ",
    "Decorator",
];

const CITIES = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Goa",
];

export function ServiceFilters({ filters, onFilterChange, onClearFilters }: ServiceFiltersProps) {
    const [localSearch, setLocalSearch] = useState((filters as any).search || "");
    const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || "");
    const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || "");

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== ((filters as any).search || "")) {
                onFilterChange({ search: localSearch || undefined } as any);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch, onFilterChange, filters]);

    // Handle Price Blur to trigger update
    const handlePriceBlur = () => {
        const min = localMinPrice ? parseInt(localMinPrice) : undefined;
        const max = localMaxPrice ? parseInt(localMaxPrice) : undefined;
        if (min !== filters.minPrice || max !== filters.maxPrice) {
            onFilterChange({ minPrice: min, maxPrice: max });
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Search</label>
                        <Input
                            placeholder="Search services..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select
                            value={filters.category || "All"}
                            onValueChange={(val) => {
                                onFilterChange({ category: val === "All" ? undefined : val });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Categories</SelectItem>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Select
                            value={filters.city || "all"}
                            onValueChange={(val) =>
                                onFilterChange({ city: val === "all" ? undefined : val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Cities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cities</SelectItem>
                                {CITIES.map((city) => (
                                    <SelectItem key={city} value={city}>
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">From</span>
                                <Input
                                    type="date"
                                    value={
                                        filters.startDate
                                            ? new Date(filters.startDate).toISOString().split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) =>
                                        onFilterChange({
                                            startDate: e.target.valueAsDate || undefined,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">To</span>
                                <Input
                                    type="date"
                                    value={
                                        filters.endDate
                                            ? new Date(filters.endDate).toISOString().split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) =>
                                        onFilterChange({
                                            endDate: e.target.valueAsDate || undefined,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price Range (₹)</label>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={localMinPrice}
                                onChange={(e) => setLocalMinPrice(e.target.value)}
                                onBlur={handlePriceBlur}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="number"
                                placeholder="Max"
                                value={localMaxPrice}
                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                onBlur={handlePriceBlur}
                            />
                        </div>
                    </div>

                    {/* Clear Button */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setLocalSearch("");
                            setLocalMinPrice("");
                            setLocalMaxPrice("");
                            onClearFilters();
                        }}
                    >
                        Clear Filters
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
