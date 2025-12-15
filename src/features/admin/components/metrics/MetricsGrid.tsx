import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServiceMetrics } from "../../hooks/useAdminServices";
import { LayoutDashboard, Calendar, CheckCircle2, IndianRupee } from "lucide-react";

export function MetricsGrid() {
    const { data: metrics, isLoading } = useServiceMetrics();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Skeleton className="h-4 w-[100px]" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const items = [
        {
            title: "Total Services",
            value: metrics?.totalServices || 0,
            icon: LayoutDashboard,
        },
        {
            title: "Total Bookings",
            value: metrics?.totalBookings || 0,
            icon: Calendar,
        },
        {
            title: "Today's Bookings",
            value: metrics?.todaysBookings || 0,
            icon: CheckCircle2,
        },
        {
            title: "Total Business",
            value: `₹${metrics?.totalRevenue?.toLocaleString() || 0}`,
            icon: IndianRupee,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <Card key={item.title} className="transition-all hover:scale-105 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {item.title}
                        </CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
