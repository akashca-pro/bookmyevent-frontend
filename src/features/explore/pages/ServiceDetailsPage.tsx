import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "../api/explore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
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
        <div className="container mx-auto max-w-7xl pt-24 pb-10 px-6 space-y-8">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary" asChild>
                <Link to="/explore">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Explore
                </Link>
            </Button>

            <ServiceHeader service={service} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ServiceInfo service={service} />
                </div>
                <div>
                    <AvailabilityCalendar serviceId={service._id!} />
                </div>
            </div>
        </div>
    );
}
