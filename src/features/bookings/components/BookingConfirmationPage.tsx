import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { confirmBooking } from "../api/bookings";
import { ServiceSummaryCard } from "./ServiceSummaryCard";
import { BookingDetailsCard } from "./BookingDetailsCard";
import { CountdownTimer } from "./CountdownTimer";
import { useDirtyBlocker } from "@/components/shared/useDirtyBlocker";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Service } from "@/features/admin/types";
import type { Booking } from "../types";
import { motion } from "framer-motion";

interface LocationState {
    service: Service;
    booking: Booking;
}

export function BookingConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const state = location.state as LocationState;
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Guard against direct access without state
    useEffect(() => {
        if (!state?.service || !state?.booking) {
            toast.error("Invalid booking session. Please start again.");
            navigate(id ? `/services/${id}` : "/explore", { replace: true });
        }
    }, [state, navigate, id]);

    // Local state for navigation blocking
    // We only want to block if NOT confirmed yet
    const isSessionActive = !isConfirmed && !!state?.service;

    // Enable blocker while session is active and not confirmed
    useDirtyBlocker(isSessionActive);

    const { mutate: confirm, isPending } = useMutation({
        mutationFn: () => confirmBooking(state.service.id!, state.booking.id || state.booking._id!),
        onSuccess: () => {
            setIsConfirmed(true);
            toast.success("Booking confirmed successfully!");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to confirm booking. Please try again.");
        }
    });

    const handleTimeout = () => {
        if (isConfirmed) return;
        toast.error("Session timed out. Please try booking again.");
        navigate(`/services/${state?.service.id}`, { replace: true });
    };

    const handleConfirm = () => {
        if (!state.booking) return;
        confirm();
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (!state?.service || !state?.booking) {
        return null;
    }

    const { service, booking } = state;
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (isConfirmed) {
        return (
            <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-background rounded-xl shadow-lg border p-8 text-center space-y-6"
                >
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Booking Confirmed!</h2>
                        <p className="text-muted-foreground">
                            Your reservation for <span className="font-medium text-foreground">{service.title}</span> is successfully confirmed.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                        <Button className="w-full" asChild>
                            <Link to="/dashboard">My Bookings</Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/explore">Explore More</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl space-y-8"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Confirm Booking</h1>
                        <p className="text-muted-foreground mt-1">
                            Please review your booking details before confirming.
                        </p>
                    </div>
                    <div>
                        <CountdownTimer onTimeout={handleTimeout} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Service Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceSummaryCard service={service} />
                    </div>

                    {/* Right Column: Booking Summary & Actions */}
                    <div className="space-y-6">
                        <BookingDetailsCard
                            startDate={startDate}
                            endDate={endDate}
                            totalDays={totalDays}
                            totalPrice={booking.totalPrice}
                        />

                        <div className="flex flex-col gap-3">
                            <Button
                                size="lg"
                                className="w-full text-lg"
                                onClick={handleConfirm}
                                disabled={isPending}
                            >
                                {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Confirm Booking
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full"
                                onClick={handleCancel}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            By clicking confirm, you agree to our terms of service and cancellation policy.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
