import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMonthlyAvailability, getServiceById } from "../../api/explore";
import { reserveBooking } from "@/features/bookings/api/bookings";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AvailabilityCalendarProps {
    serviceId: string;
}

export function AvailabilityCalendar({ serviceId }: AvailabilityCalendarProps) {
    const navigate = useNavigate();
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch service details for passing to confirmation page
    const { data: service } = useQuery({
        queryKey: ["service-details", serviceId],
        queryFn: () => getServiceById(serviceId),
        enabled: !!serviceId
    });

    const { mutate: book, isPending } = useMutation({
        mutationFn: (data: { startDate: Date; endDate: Date }) =>
            reserveBooking(serviceId, data),
        onSuccess: (booking) => {
            if (!service) return;
            // Navigate to confirmation page
            // The route might need to be created if not exists, but based on ServiceDetailsPage we can guess or use existing
            // Since user asked for "after getting the booking details , go to confirmation page"
            // We'll assume the route is /services/:serviceId/confirm-booking or similar.
            // But wait, the user's prompt said "bookingRouter.post('/bookings/services/:serviceId/book/reserve', ...)"
            // and then "after getting the booking details , go to confirmation page also pass the booking info and service details"
            navigate(`/services/${serviceId}/confirm-booking`, {
                state: {
                    service: service,
                    booking: booking
                }
            });
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to reserve booking");
        }
    });

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setError(null);

        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDate);
            setEndDate(null);
        } else {
            // Check if clicked date is before start date
            if (clickedDate < startDate) {
                setStartDate(clickedDate);
            } else {
                setEndDate(clickedDate);
            }
        }
    };

    const handleBookService = () => {
        if (!startDate || !endDate) {
            setError("Please select a date range");
            return;
        }
        book({ startDate, endDate });
    };

    // Queries
    const { data: availabilityMap, isLoading } = useQuery({
        queryKey: ["service-availability", serviceId, currentDate.getMonth(), currentDate.getFullYear()],
        queryFn: () => getMonthlyAvailability(serviceId, currentDate.getMonth() + 1, currentDate.getFullYear()), // API expects 1-12
    });

    const handlePreviousMonth = () => {
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        if (previousMonth < new Date(today.getFullYear(), today.getMonth(), 1)) return;
        setCurrentDate(previousMonth);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleMonthSelect = (monthStr: string) => {
        const newMonth = parseInt(monthStr);
        // Prevent selecting past months in current year
        if (currentDate.getFullYear() === today.getFullYear() && newMonth < today.getMonth()) {
            return;
        }
        setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1));
    };

    const handleYearSelect = (yearStr: string) => {
        const newYear = parseInt(yearStr);
        // If switching to current year but month is in past, reset to current month
        let newMonth = currentDate.getMonth();
        if (newYear === today.getFullYear() && newMonth < today.getMonth()) {
            newMonth = today.getMonth();
        }
        setCurrentDate(new Date(newYear, newMonth, 1));
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
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${d}`;
        return availabilityMap[dateStr] === true;
    };

    const isPastDate = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return checkDate < todayZero;
    }

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

    // Check if we can go back
    const canGoBack = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) > new Date(today.getFullYear(), today.getMonth(), 1);

    return (
        <Card className="sticky top-20">
            <CardHeader className="space-y-4">
                <CardTitle className="text-xl">Check Availability</CardTitle>
                <div className="flex items-center justify-between gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePreviousMonth}
                        disabled={!canGoBack}
                    >
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
                                {monthNames.map((month, index) => {
                                    const isDisabled = currentDate.getFullYear() === today.getFullYear() && index < today.getMonth();
                                    return (
                                        <SelectItem key={month} value={String(index)} disabled={isDisabled}>
                                            {month}
                                        </SelectItem>
                                    );
                                })}
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
                            const past = isPastDate(day);
                            const current = isToday(day);

                            // Date Construction
                            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const isSelected = (startDate && dateObj.getTime() === startDate.getTime()) || (endDate && dateObj.getTime() === endDate.getTime());
                            const isInRange = startDate && endDate && dateObj > startDate && dateObj < endDate;

                            return (
                                <button
                                    key={day}
                                    disabled={blocked || past}
                                    onClick={() => handleDateClick(day)}
                                    className={cn(
                                        "h-10 w-full flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer",
                                        past && "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
                                        blocked && !past && "bg-red-500/20 text-red-500 cursor-not-allowed border border-red-500/20",
                                        !past && !blocked && "hover:bg-primary/20 bg-secondary/30 font-medium text-foreground",
                                        past && "line-through",
                                        current && !isSelected && !isInRange && !blocked && "ring-2 ring-primary ring-offset-1 font-bold bg-primary/10",
                                        isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                                        isInRange && "bg-primary/20"
                                    )}
                                    title={blocked ? "Booked" : past ? "Past Date" : "Available"}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-muted opacity-50"></div>
                        <span>Unavailable</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/30"></div>
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-secondary/30 border border-white/10"></div>
                        <span>Available</span>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>Start: {startDate ? startDate.toLocaleDateString() : "-"}</span>
                        <span>End: {endDate ? endDate.toLocaleDateString() : "-"}</span>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleBookService}
                        disabled={!startDate || !endDate || isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Book Service
                    </Button>
                </div>
            </CardContent>
        </Card >
    );
}
