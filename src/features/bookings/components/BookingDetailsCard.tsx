import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CreditCard } from "lucide-react";

interface BookingDetailsCardProps {
    startDate: Date;
    endDate: Date;
    totalDays: number;
    totalPrice: number;
}

export function BookingDetailsCard({ startDate, endDate, totalDays, totalPrice }: BookingDetailsCardProps) {
    return (
        <Card className="bg-muted/50">
            <CardContent className="pt-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                                <p className="font-semibold">{startDate.toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                                <p className="font-semibold">{endDate.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-full">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Duration</p>
                                <p className="font-semibold">{totalDays} Days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-full">
                                <CreditCard className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Total Price</p>
                                <p className="font-bold text-lg text-primary">₹{totalPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
