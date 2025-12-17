import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "../api/explore";
import { Loader2 } from "lucide-react";
import { ServiceHeader } from "../components/ServiceDetails/ServiceHeader";
import { ServiceInfo } from "../components/ServiceDetails/ServiceInfo";
import { AvailabilityCalendar } from "../components/ServiceDetails/AvailabilityCalendar";

export function ServiceDetailsPage() {
    const { id } = useParams<{ id: string }>();

    const { data: service, isLoading, error } = useQuery({
        queryKey: ["service-details", id],
        queryFn: () => getServiceById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="container py-10 text-center text-muted-foreground">
                Service not found or failed to load.
            </div>
        );
    }

    return (
        <div className="container max-w-7xl py-10 space-y-8">
            <ServiceHeader service={service} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ServiceInfo service={service} />
                </div>
                <div>
                    <AvailabilityCalendar serviceId={service.id} />
                </div>
            </div>
        </div>
    );
}
