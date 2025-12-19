import type { ServiceDetailsDTO } from "../../api/explore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";

interface ServiceInfoProps {
    service: ServiceDetailsDTO;
}

export function ServiceInfo({ service }: ServiceInfoProps) {
    return (
        <div className="space-y-8">
            {/* Description Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">About this Service</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{service.description}</p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Location Card */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <MapPin className="mr-2 h-5 w-5 text-primary" />
                            Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>{service.location.address}</p>
                        <p>{service.location.district}, {service.location.municipality}, {service.location.pincode}</p>
                    </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Phone className="mr-2 h-5 w-5 text-primary" />
                            Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{service.contact.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${service.contact.email}`} className="hover:underline text-primary">
                                {service.contact.email}
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Availability Text */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                        Availability Period
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Available from{" "}
                    <span className="font-medium text-foreground">
                        {new Date(service.availability.from).toLocaleDateString()}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-foreground">
                        {new Date(service.availability.to).toLocaleDateString()}
                    </span>
                </CardContent>
            </Card>
        </div>
    );
}
