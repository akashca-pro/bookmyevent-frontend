import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { UserBooking } from "../types";
import { formatDate } from "date-fns";
import { Calendar, IndianRupee } from "lucide-react";
import { getCloudinaryUrl } from "@/utils/cloudinaryImageUrl";

import { useNavigate } from "react-router-dom";

interface BookingCardProps {
    booking: UserBooking;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
    const navigate = useNavigate();
    const { bookingDetails, serviceDetails } = booking;
    const { _id, title, description, thumbnail } = serviceDetails;
    const { startDate, endDate, totalPrice, status } = bookingDetails;

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

    return (
        <Card
            onClick={() => navigate(`/services/${_id}`)}
            className="cursor-pointer overflow-hidden bg-black/40 border-white/10 hover:border-neon-purple/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(180,41,255,0.15)] flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden">
                {thumbnail ? (
                    <img
                        src={getCloudinaryUrl(thumbnail)}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                <h3 className="text-xl font-bold text-white group-hover:text-neon-purple transition-colors line-clamp-1">
                    {title}
                </h3>
            </CardHeader>

            <CardContent className="p-4 py-2 flex-grow space-y-3">
                <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px]">
                    {description}
                </p>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-neon-blue" />
                        <span>{formatDate(new Date(startDate), "PPP")} - {formatDate(new Date(endDate), "PPP")}</span>
                    </div>
                    {/* Removed the time-only clock line as it's redundant/incorrect if dates are the focus */}
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
