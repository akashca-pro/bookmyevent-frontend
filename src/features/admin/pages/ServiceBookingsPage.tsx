import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchServiceBookings, getService } from "../api/services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, IndianRupee, CalendarDays, User } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingFilters } from "@/features/bookings/components/BookingFilters";

export default function ServiceBookingsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState(JSON.stringify({ "createdAt": -1 }));
    const limit = 10;

    // Fetch service details for context
    const { data: service, isLoading: isServiceLoading } = useQuery({
        queryKey: ["service", id],
        queryFn: () => getService(id!),
        enabled: !!id
    });

    // Fetch bookings
    const { data: bookingsData, isLoading: isBookingsLoading } = useQuery({
        queryKey: ["service-bookings", id, page, status, sort],
        queryFn: () => fetchServiceBookings(id!, { page, limit, sort, status }),
        enabled: !!id
    });

    const isLoading = isServiceLoading || isBookingsLoading;

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!service) return <div className="p-8 text-center text-red-500">Service not found</div>;

    const { data: bookings = [], total = 0 } = bookingsData || {};
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="container mx-auto px-6 pt-24 pb-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Booking History</h1>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                            Service: <span className="font-medium text-foreground">{service.title}</span>
                            <Badge variant="outline" className="ml-2 text-xs">{service.category?.name}</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0 pb-6">
                    <div className="space-y-1.5">
                        <CardTitle>All Bookings</CardTitle>
                        <CardDescription>
                            View and manage all booking requests for this service.
                        </CardDescription>
                    </div>
                    <BookingFilters
                        status={status}
                        sort={sort}
                        onStatusChange={(v) => { setStatus(v); setPage(1); }}
                        onSortChange={(v) => { setSort(v); setPage(1); }}
                        onClearFilters={() => {
                            setStatus("all");
                            setSort(JSON.stringify({ "createdAt": -1 }));
                            setPage(1);
                        }}
                    />
                </CardHeader>
                <CardContent>
                    {!bookings.length ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                            <CalendarDays className="h-12 w-12 mb-4 opacity-20" />
                            <h3 className="text-lg font-medium text-foreground">No bookings yet</h3>
                            <p className="max-w-sm mt-1">This service hasn't received any bookings. Promote your service to get more attention!</p>
                        </div>
                    ) : (
                        <div className="rounded-md border bg-background">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[300px]">User</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Booked On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((item, i) => (
                                        item?.user ? (
                                            <TableRow key={i} className="group hover:bg-muted/30">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border">
                                                            <AvatarImage src={item.user.avatar || undefined} />
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                <User className="h-4 w-4" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{item.user.name}</div>
                                                            <div className="text-xs text-muted-foreground">{item.user.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-sm">
                                                        <span className="font-medium">{format(new Date(item.bookingDetails.startDate), "MMM dd, yyyy")}</span>
                                                        <span className="text-muted-foreground text-xs">to {format(new Date(item.bookingDetails.endDate), "MMM dd, yyyy")}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center font-medium">
                                                        <IndianRupee className="h-3 w-3 mr-1 text-muted-foreground" />
                                                        {item.bookingDetails.totalPrice.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            item.bookingDetails.status === 'confirmed' ? 'default' :
                                                                item.bookingDetails.status === 'pending' ? 'secondary' :
                                                                    item.bookingDetails.status === 'cancelled' ? 'destructive' : 'outline'
                                                        }
                                                        className="capitalize"
                                                    >
                                                        {item.bookingDetails.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground text-sm">
                                                    {format(new Date(item.bookingDetails.createdAt), "MMM dd, yyyy")}
                                                </TableCell>
                                            </TableRow>
                                        ) : null
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
