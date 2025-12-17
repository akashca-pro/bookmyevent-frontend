import { getCloudinaryUrl } from "@/utils/cloudinaryImageUrl";
import { Badge } from "@/components/ui/badge";
import type { ServiceDetailsDTO } from "../../api/explore";
import { IndianRupee, MapPin } from "lucide-react";

interface ServiceHeaderProps {
    service: ServiceDetailsDTO;
}

export function ServiceHeader({ service }: ServiceHeaderProps) {
    const imageUrl = getCloudinaryUrl(service.thumbnail);

    return (
        <div className="space-y-6">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted shadow-sm">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        No Image Available
                    </div>
                )}
                {/* Overlay Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant="secondary" className="backdrop-blur-md bg-white/80 text-foreground">
                        {service.category}
                    </Badge>
                    {!service.isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{service.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-1.5 h-4 w-4" />
                        <span>{service.location.city}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center text-2xl font-bold text-primary">
                        <IndianRupee className="mr-0.5 h-5 w-5" />
                        {service.pricePerDay.toLocaleString()}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">/ day</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
