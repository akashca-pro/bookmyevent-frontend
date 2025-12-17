import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getServiceAvailability } from "../../api/explore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailabilityCalendarProps {
    serviceId: string;
}

export function AvailabilityCalendar({ serviceId }: AvailabilityCalendarProps) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    // Queries
    const { data: availabilityMap, isLoading } = useQuery({
        queryKey: ["service-availability", serviceId, currentDate.getMonth(), currentDate.getFullYear()],
        queryFn: () => getServiceAvailability(serviceId, currentDate.getMonth() + 1, currentDate.getFullYear()), // API expects 1-12
    });

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleMonthSelect = (monthStr: string) => {
        setCurrentDate(new Date(currentDate.getFullYear(), parseInt(monthStr), 1));
    };

    const handleYearSelect = (yearStr: string) => {
        setCurrentDate(new Date(parseInt(yearStr), currentDate.getMonth(), 1));
    };

    // Calendar Grid Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Generate empty placeholders for start of month alignment
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const isDateBooked = (day: number) => {
        if (!availabilityMap) return false;
        // Construct date string YYYY-MM-DD manually to match API response format likely YYYY-MM-DD
        // Assuming API returns keys as YYYY-MM-DD.
        // Needs careful padding.
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${d}`;
        return availabilityMap[dateStr] === true;
    };

    const isToday = (day: number) => {
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const generateYears = () => {
        const currentYear = today.getFullYear();
        return Array.from({ length: 3 }, (_, i) => currentYear + i); // Current + next 2 years
    };

    return (
        <Card className="sticky top-20">
            <CardHeader className="space-y-4">
                <CardTitle className="text-xl">Check Availability</CardTitle>
                <div className="flex items-center justify-between gap-2">
                    <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-2">
                        <Select
                            value={String(currentDate.getMonth())}
                            onValueChange={handleMonthSelect}
                        >
                            <SelectTrigger className="w-[110px]">
                                <SelectValue>{monthNames[currentDate.getMonth()]}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((month, index) => (
                                    <SelectItem key={month} value={String(index)}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={String(currentDate.getFullYear())}
                            onValueChange={handleYearSelect}
                        >
                            <SelectTrigger className="w-[90px]">
                                <SelectValue>{currentDate.getFullYear()}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {generateYears().map(year => (
                                    <SelectItem key={year} value={String(year)}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2 text-center text-sm font-medium text-muted-foreground">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                        <div key={d} className="py-1">{d}</div>
                    ))}
                </div>

                {isLoading ? (
                    <div className="h-48 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty Slots */}
                        {emptyDays.map(i => (
                            <div key={`empty-${i}`} className="h-10 w-full" />
                        ))}

                        {/* Days */}
                        {days.map(day => {
                            const blocked = isDateBooked(day);
                            const current = isToday(day);

                            return (
                                <div
                                    key={day}
                                    className={cn(
                                        "h-10 w-full flex items-center justify-center rounded-md text-sm transition-colors cursor-default",
                                        blocked
                                            ? "bg-muted text-muted-foreground line-through cursor-not-allowed opacity-50"
                                            : "hover:bg-primary/20 bg-secondary/30 font-medium text-foreground",
                                        current && "ring-2 ring-primary ring-offset-1 font-bold bg-primary/10"
                                    )}
                                    title={blocked ? "Booked" : "Available"}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6">
                    <Button className="w-full" size="lg">
                        Book Service
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        Select dates to book (Implementation Pending)
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
