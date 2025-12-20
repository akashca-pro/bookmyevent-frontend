import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DistrictSelect, MunicipalitySelect } from "@/components/shared/LocationSelectors";
import { Label } from "@/components/ui/label";

import { useSearchParams } from "react-router-dom";
import { useCategoriesOptions } from "@/hooks/useCategoriesOptions";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";



export function ServiceFilters() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: categories } = useCategoriesOptions();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    // Debounce search update to URL
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchParams(prev => {
                const currentSearch = prev.get("search") || "";
                if (currentSearch === search) return prev;

                const next = new URLSearchParams(prev);
                if (search) {
                    next.set("search", search);
                } else {
                    next.delete("search");
                }
                next.set("page", "1");
                return next;
            });
        }, 500);

        return () => clearTimeout(handler);
    }, [search, setSearchParams]);

    // Handle other filters directly without extra debounce (Assuming inputs are already distinct or don't need debounce like select)
    // For price range, we do need separate debounce or handling. 
    // Let's use the local state + effect pattern for prices as well.

    const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedMinPrice(minPrice);
        }, 500);
        return () => clearTimeout(handler);
    }, [minPrice]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedMaxPrice(maxPrice);
        }, 500);
        return () => clearTimeout(handler);
    }, [maxPrice]);

    useEffect(() => {
        setSearchParams(prev => {
            const current = prev.get("minPrice") || "";
            if (current === debouncedMinPrice) return prev;
            const next = new URLSearchParams(prev);
            if (debouncedMinPrice) next.set("minPrice", debouncedMinPrice);
            else next.delete("minPrice");
            next.set("page", "1");
            return next;
        });
    }, [debouncedMinPrice, setSearchParams]);

    useEffect(() => {
        setSearchParams(prev => {
            const current = prev.get("maxPrice") || "";
            if (current === debouncedMaxPrice) return prev;
            const next = new URLSearchParams(prev);
            if (debouncedMaxPrice) next.set("maxPrice", debouncedMaxPrice);
            else next.delete("maxPrice");
            next.set("page", "1");
            return next;
        });
    }, [debouncedMaxPrice, setSearchParams]);

    const updateParam = useCallback((key: string, value: string) => {
        setSearchParams(prev => {
            const currentVal = prev.get(key) || "";
            if (currentVal === value) return prev;

            const next = new URLSearchParams(prev);
            if (value && value !== "all") {
                next.set(key, value);
            } else {
                next.delete(key);
            }
            if (key === "district") next.delete("municipality");
            next.set("page", "1");
            return next;
        });
    }, [setSearchParams]);

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
                            {categories?.map((cat) => (
                                <SelectItem key={cat.id} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>District</Label>
                        <DistrictSelect
                            label=""
                            value={searchParams.get("district") || ""}
                            onValueChange={(val) => {
                                setSearchParams(prev => {
                                    const next = new URLSearchParams(prev);
                                    if (val && val !== "all") {
                                        next.set("district", val);
                                    } else {
                                        next.delete("district");
                                    }
                                    next.delete("municipality"); // Reset municipality
                                    next.set("page", "1");
                                    return next;
                                });
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Municipality</Label>
                        <MunicipalitySelect
                            label=""
                            district={searchParams.get("district") || ""}
                            value={searchParams.get("municipality") || ""}
                            onValueChange={(val) => updateParam("municipality", val === "all" ? "" : val)}
                            disabled={!searchParams.get("district")}
                        />
                    </div>
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
