import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchServices,
    fetchServiceMetrics,
    createService,
    updateService,
    uploadThumbnail
} from "../api/services";
import type { GetServicesParams, UpdateServiceFuncArgs, CreateServiceFuncArgs, Service, PaginationDTO } from "../types";
import { toast } from "sonner";


export const useAdminServices = (params: GetServicesParams) => {
    return useQuery<PaginationDTO<Service>, Error>({
        queryKey: ["admin-services", params],
        queryFn: () => fetchServices(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useServiceMetrics = () => {
    return useQuery({
        queryKey: ["admin-service-metrics"],
        queryFn: fetchServiceMetrics,
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateServiceFuncArgs) => createService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-services"] });
            queryClient.invalidateQueries({ queryKey: ["admin-service-metrics"] });
            toast.success("Service created successfully");
        },
        onError: (error: any) => {
            // Check if it's a validation error with details
            if (error.details && Array.isArray(error.details)) {
                error.details.forEach((err: any) => {
                    toast.error(err.message || "Validation Error", {
                        description: `Field: ${err.field} `
                    });
                });
            } else {
                toast.error(`Failed to create service: ${error.message || "Unknown error"} `);
            }
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateServiceFuncArgs }) => updateService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-services"] });
            toast.success("Service updated successfully");
        },
        onError: (error: any) => {
            const apiErrors = error?.error

            if (Array.isArray(apiErrors) && apiErrors.length > 0) {
                apiErrors.forEach((e: any) => {
                    toast.error(`field : ${e.field}`, {
                        description: `Error : ${e.message}`,
                    })
                })
            }
            toast.error('Error', {
                description: error?.message
            })
        },
    });
};

export const useUploadThumbnail = () => {
    return useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) => uploadThumbnail(id, file),
        onSuccess: () => {
            toast.success("Thumbnail uploaded successfully");
        },
        onError: (error: any) => {
            toast.error(`Failed to upload thumbnail: ${error.message} `);
        },
    });
};
