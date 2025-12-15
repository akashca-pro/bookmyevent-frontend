import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import type { Service } from "../../types";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ServiceDetailsSheetProps {
    service: Service | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ServiceDetailsSheet({ service, open, onOpenChange }: ServiceDetailsSheetProps) {
    if (!service) return null;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
                <SheetHeader>
                    <SheetTitle>{service.title}</SheetTitle>
                    <SheetDescription>
                        {service.id || service._id}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-2"
                            onClick={() => copyToClipboard(service.id || service._id || "", "ID")}
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        {service.thumbnail ? (
                            <img src={service.thumbnail} alt={service.title} className="object-cover w-full h-full" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                No Thumbnail
                            </div>
                        )}
                        <Badge className="absolute top-2 right-2">{service.category}</Badge>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {service.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-sm">Price per Day</h4>
                            <p className="text-sm">₹{service.pricePerDay.toLocaleString()}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Status</h4>
                            <Badge variant={service.isActive ? "default" : "destructive"}>
                                {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold border-b pb-1 mb-2">Location</h4>
                        <div className="space-y-1 text-sm">
                            <p>{service.location?.address}</p>
                            <p>{service.location?.city}, {service.location?.pincode}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold border-b pb-1 mb-2">Contact</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span>{service.contact?.email}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(service.contact?.email, "Email")}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>{service.contact?.phone}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(service.contact?.phone, "Phone")}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
