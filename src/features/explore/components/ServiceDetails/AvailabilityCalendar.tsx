import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMonthlyAvailability, getServiceById } from "../../api/explore";
import { reserveBooking } from "@/features/bookings/api/bookings";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/useAppSelector";

interface AvailabilityCalendarProps {
    serviceId: string;
}

export function AvailabilityCalendar({ serviceId }: AvailabilityCalendarProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
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

        if (service?.availability) {
            const availableFrom = new Date(service.availability.from);
            const availableTo = new Date(service.availability.to);
            availableFrom.setHours(0, 0, 0, 0);
            availableTo.setHours(0, 0, 0, 0);

            if (clickedDate < availableFrom || clickedDate > availableTo) return;
        }

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

        // Check if user is authenticated
        if (!isAuthenticated) {
            toast.custom((t) => (
                <div className="flex items-center gap-4 bg-background border border-border rounded-lg p-4 shadow-lg">
                    <div className="flex-1">
                        <p className="font-medium text-foreground">Login Required</p>
                        <p className="text-sm text-muted-foreground">Please login to book this service</p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            toast.dismiss(t);
                            navigate("/login");
                        }}
                        className="gap-2"
                    >
                        <LogIn className="h-4 w-4" />
                        Login to Book
                    </Button>
                </div>
            ), {
                duration: 5000,
            });
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

        // Check against today
        if (previousMonth < new Date(today.getFullYear(), today.getMonth(), 1)) return;

        // Check against service availability start
        if (service?.availability) {
            const availableFrom = new Date(service.availability.from);
            // Allow if month is same or after available month
            const prevMonthEnd = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
            if (prevMonthEnd < availableFrom) return;
        }

        setCurrentDate(previousMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        // Check against service availability end
        if (service?.availability) {
            const availableTo = new Date(service.availability.to);
            // Allow if month is same or before available month
            if (nextMonth > availableTo) return;
        }

        setCurrentDate(nextMonth);
    };

    const handleMonthSelect = (monthStr: string) => {
        const newMonth = parseInt(monthStr);
        const newDate = new Date(currentDate.getFullYear(), newMonth, 1);

        // Prevent selecting past months in current year
        if (currentDate.getFullYear() === today.getFullYear() && newMonth < today.getMonth()) {
            return;
        }

        if (service?.availability) {
            const availableFrom = new Date(service.availability.from);
            const availableTo = new Date(service.availability.to);
            const newDateEnd = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

            if (newDateEnd < availableFrom || newDate > availableTo) return;
        }

        setCurrentDate(newDate);
    };

    const handleYearSelect = (yearStr: string) => {
        const newYear = parseInt(yearStr);
        let newMonth = currentDate.getMonth();

        // If switching to current year but month is in past, reset to current month
        if (newYear === today.getFullYear() && newMonth < today.getMonth()) {
            newMonth = today.getMonth();
        }

        const newDate = new Date(newYear, newMonth, 1);

        if (service?.availability) {
            const availableFrom = new Date(service.availability.from);
            const availableTo = new Date(service.availability.to);
            // If selected year/month is out of range, try to find a valid month in that year
            if (newDate > availableTo || newDate < availableFrom) {
                // Logic to clamp to valid range could go here, but for now just basic valid check or keeping current logic
                // Let's just allow switch but if it lands on invalid month, user can navigate
                // Or better: auto-adjust month if possible. 

                // If year is within range but month isn't, maybe we can accept. 
                // But simplest is to just allow and let the date cells be disabled.
            }
        }

        setCurrentDate(newDate);
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
        if (service?.availability) {
            const startYear = new Date(service.availability.from).getFullYear();
            const endYear = new Date(service.availability.to).getFullYear();
            const years: number[] = [];
            for (let i = startYear; i <= endYear; i++) {
                if (i >= today.getFullYear()) years.push(i);
            }
            return years.length > 0 ? years : [today.getFullYear()];
        }

        const currentYear = today.getFullYear();
        return Array.from({ length: 3 }, (_, i) => currentYear + i); // Fallback
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

                            // Availability Check
                            let isOutOfAvailability = false;
                            if (service?.availability) {
                                const availableFrom = new Date(service.availability.from);
                                const availableTo = new Date(service.availability.to);
                                // Reset times for accurate date comparison
                                availableFrom.setHours(0, 0, 0, 0);
                                availableTo.setHours(0, 0, 0, 0);

                                isOutOfAvailability = dateObj < availableFrom || dateObj > availableTo;
                            }

                            const isSelected = (startDate && dateObj.getTime() === startDate.getTime()) || (endDate && dateObj.getTime() === endDate.getTime());
                            const isInRange = startDate && endDate && dateObj > startDate && dateObj < endDate;

                            return (
                                <button
                                    key={day}
                                    disabled={blocked || past || isOutOfAvailability}
                                    onClick={() => !isOutOfAvailability && handleDateClick(day)}
                                    className={cn(
                                        "h-10 w-full flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer",
                                        (past || isOutOfAvailability) && "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
                                        blocked && !past && !isOutOfAvailability && "bg-red-500/20 text-red-500 cursor-not-allowed border border-red-500/20",
                                        !past && !blocked && !isOutOfAvailability && "hover:bg-primary/20 bg-secondary/30 font-medium text-foreground",
                                        past && "line-through",
                                        current && !isSelected && !isInRange && !blocked && "ring-2 ring-primary ring-offset-1 font-bold bg-primary/10",
                                        isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                                        isInRange && "bg-primary/20"
                                    )}
                                    title={blocked ? "Booked" : (past || isOutOfAvailability) ? "Unavailable" : "Available"}
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
