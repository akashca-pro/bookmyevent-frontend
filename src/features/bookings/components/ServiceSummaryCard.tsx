import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Service } from "@/features/admin/types";
import { getCloudinaryUrl } from "@/utils/cloudinaryImageUrl";

interface ServiceSummaryCardProps {
    service: Service;
}

export function ServiceSummaryCard({ service }: ServiceSummaryCardProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                            {service.category.name}
                        </Badge>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold">₹{service.pricePerDay}</span>
                        <span className="text-sm text-muted-foreground block">per day</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {service.thumbnail && (
                    <div className="aspect-video w-full overflow-hidden rounded-md border">
                        <img
                            src={getCloudinaryUrl(service.thumbnail)}
                            alt={service.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                </p>

                <Separator />

                <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {service.location.address}, {service.location.city} - {service.location.pincode}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{service.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{service.contact.email}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
