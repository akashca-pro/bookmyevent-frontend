import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Fallback if useDebounce doesn't exist in hooks
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function ServiceFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    const debouncedSearch = useDebounceValue(search, 500);
    const debouncedMinPrice = useDebounceValue(minPrice, 500);
    const debouncedMaxPrice = useDebounceValue(maxPrice, 500);

    const updateParam = (key: string, value: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (value) {
                next.set(key, value);
            } else {
                next.delete(key);
            }
            // Reset page on filter change
            next.set("page", "1");
            return next;
        });
    };

    useEffect(() => updateParam("search", debouncedSearch), [debouncedSearch]);
    useEffect(() => updateParam("minPrice", debouncedMinPrice), [debouncedMinPrice]);
    useEffect(() => updateParam("maxPrice", debouncedMaxPrice), [debouncedMaxPrice]);

    const handleClear = () => {
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
        setSearchParams(new URLSearchParams());
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Filters</h3>
                {(searchParams.toString() && searchParams.toString() !== "page=1") && (
                    <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2 lg:px-3 text-muted-foreground">
                        Clear
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <Input
                        id="search"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                        value={searchParams.get("category") || ""}
                        onValueChange={(val) => updateParam("category", val === "all" ? "" : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="venue">Venue</SelectItem>
                            <SelectItem value="catering">Catering</SelectItem>
                            <SelectItem value="photography">Photography</SelectItem>
                            <SelectItem value="decoration">Decoration</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select
                        value={searchParams.get("city") || ""}
                        onValueChange={(val) => updateParam("city", val === "all" ? "" : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                            <SelectItem value="Bangalore">Bangalore</SelectItem>
                            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Price Range</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
