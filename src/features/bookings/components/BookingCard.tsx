import { memo, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { UserBooking } from "../types";
import { formatDate, differenceInCalendarDays } from "date-fns";
import { Calendar, IndianRupee, Clock } from "lucide-react";
import { getCloudinaryUrl } from "@/utils/cloudinaryImageUrl";
import { useNavigate } from "react-router-dom";

interface BookingCardProps {
    booking: UserBooking;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "confirmed":
        case "approved":
            return "bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20";
        case "pending":
            return "bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25 border-yellow-500/20";
        case "cancelled":
        case "rejected":
            return "bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20";
        case "completed":
            return "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border-blue-500/20";
        default:
            return "bg-gray-500/15 text-gray-500 hover:bg-gray-500/25 border-gray-500/20";
    }
};

const BookingCardComponent = ({ booking }: BookingCardProps) => {
    const navigate = useNavigate();
    const { bookingDetails, serviceDetails } = booking;
    const { _id, title, description, thumbnail } = serviceDetails;
    const { startDate, endDate, totalPrice, status } = bookingDetails;

    const { durationDays, timeStatus, timeStatusColor } = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        const duration = differenceInCalendarDays(end, start);
        const daysUntilStart = differenceInCalendarDays(start, today);
        const daysUntilEnd = differenceInCalendarDays(end, today);

        let status = "";
        let color = "text-gray-400";

        if (daysUntilStart > 0) {
            status = `Starts in ${daysUntilStart} day${daysUntilStart !== 1 ? "s" : ""}`;
            color = "text-neon-blue";
        } else if (daysUntilEnd >= 0) {
            status = `Ends in ${daysUntilEnd} day${daysUntilEnd !== 1 ? "s" : ""}`;
            color = "text-green-400";
        } else {
            status = "Completed";
            color = "text-gray-500";
        }

        return { durationDays: duration, timeStatus: status, timeStatusColor: color };
    }, [startDate, endDate]);

    const formattedDates = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${formatDate(start, "PPP")} - ${formatDate(end, "PPP")}`;
    }, [startDate, endDate]);

    const handleNavigate = useCallback(() => navigate(`/services/${_id}`), [navigate, _id]);

    const imageUrl = useMemo(() => thumbnail ? getCloudinaryUrl(thumbnail) : null, [thumbnail]);

    return (
        <Card className="overflow-hidden bg-black/40 border-white/10 hover:border-neon-purple/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(180,41,255,0.15)] flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                        No Image
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <Badge className={`${getStatusColor(status)} backdrop-blur-md border capitalize`}>
                        {status}
                    </Badge>
                </div>
            </div>
            <CardHeader className="p-4 pb-2">
                <h3
                    onClick={handleNavigate}
                    className="text-xl font-bold text-white hover:text-neon-purple transition-colors line-clamp-1 cursor-pointer w-fit"
                >
                    {title}
                </h3>
            </CardHeader>
            <CardContent className="p-4 py-2 flex-grow space-y-4">
                <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px]">{description}</p>
                <div className="space-y-3 text-sm border-t border-white/5 pt-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-2 text-neon-blue" />
                            <span>{formattedDates}</span>
                        </div>
                        <div className="flex items-center text-gray-400 ml-6 text-xs">
                            Duration: {durationDays} days
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Clock className={`w-4 h-4 mr-2 ${timeStatusColor}`} />
                        <span className={`font-medium ${timeStatusColor}`}>{timeStatus}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 border-t border-white/5 flex justify-between items-center mt-auto">
                <div className="flex items-center text-neon-green font-bold text-lg">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {totalPrice.toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    );
};

export const BookingCard = memo(BookingCardComponent);
