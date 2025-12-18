import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminServices } from "../../hooks/useAdminServices";
import { ServiceFilters } from "../filters/ServiceFilters";
import { ServiceList } from "../services/ServiceList";
import { CreateServiceModal } from "../modals/CreateServiceModal";
import { EditServiceModal } from "../modals/EditServiceModal";
import { ServiceDetailsSheet } from "../modals/ServiceDetailsSheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Service } from "../../types";

export function ServicesTab() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const { data, isLoading } = useAdminServices({
        page,
        limit,
        search: searchParams.get("search") || undefined,
        category: searchParams.get("category") || undefined,
        city: searchParams.get("city") || undefined,
        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const handleEdit = (service: Service) => {
        setSelectedService(service);
        setIsEditOpen(true);
    };

    const handleView = (service: Service) => {
        setSelectedService(service);
        setIsDetailsOpen(true);
    };

    const setPage = (newPage: number) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("page", newPage.toString());
            return next;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6">
            {/* Header Row */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Services</h2>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Service
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Filters */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="sticky top-6">
                        <ServiceFilters />
                    </div>
                </aside>

                {/* Right Column: List */}
                <main className="flex-1 min-w-0">
                    <ServiceList
                        data={data}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onView={handleView}
                        page={page}
                        setPage={setPage}
                    />
                </main>
            </div>

            {/* Modals */}
            <CreateServiceModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

            {selectedService && (
                <>
                    <EditServiceModal
                        service={selectedService}
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                    />
                    <ServiceDetailsSheet
                        service={selectedService}
                        open={isDetailsOpen}
                        onOpenChange={setIsDetailsOpen}
                    />
                </>
            )}
        </div>
    );
}
