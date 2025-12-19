import { getCloudinaryUrl } from "@/utils/cloudinaryImageUrl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, MapPin, IndianRupee } from "lucide-react";
import type { Service } from "../../types";

interface AdminServiceCardProps {
    service: Service;
    onEdit: (service: Service) => void;
    onView: (service: Service) => void;
    onViewBookings: (service: Service) => void;
}

export function AdminServiceCard({ service, onEdit, onView, onViewBookings }: AdminServiceCardProps) {
    const imageUrl = getCloudinaryUrl(service.thumbnail);

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="relative aspect-video bg-muted overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={service.title}
                        className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary">
                        {service.category.name}
                    </Badge>
                </div>
                {!service.isActive && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                        <Badge variant="destructive">Inactive</Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-semibold line-clamp-1" title={service.title}>{service.title}</h3>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-[40px]">
                    {service.description}
                </p>

                <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{service.location?.district}, {service.location?.municipality}</span>
                </div>

                <div className="flex items-center font-medium text-foreground">
                    <IndianRupee className="h-3 w-3 mr-0.5" />
                    {service.pricePerDay.toLocaleString()} <span className="text-xs text-muted-foreground ml-1 font-normal">/ day</span>
                </div>

                <div className="mt-3 text-xs text-muted-foreground border-t pt-3 flex justify-between">
                    <span>
                        {service.availability?.from ? new Date(service.availability.from).toLocaleDateString() : 'N/A'}
                        {' - '}
                        {service.availability?.to ? new Date(service.availability.to).toLocaleDateString() : 'N/A'}
                    </span>
                    <span>{service.isActive ? 'Active' : 'Inactive'}</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid grid-cols-3 gap-2 mt-auto">
                <Button variant="outline" size="sm" onClick={() => onView(service)} className="w-full px-0">
                    <Eye className="h-3 w-3 sm:mr-2" />
                    <span className="hidden sm:inline">Details</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => onViewBookings(service)} className="w-full px-0">
                    <IndianRupee className="h-3 w-3 sm:mr-2" />
                    <span className="hidden sm:inline">Bookings</span>
                </Button>
                <Button size="sm" onClick={() => onEdit(service)} className="w-full px-0">
                    <Edit2 className="h-3 w-3 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                </Button>
            </CardFooter>
        </Card>
    );
}
