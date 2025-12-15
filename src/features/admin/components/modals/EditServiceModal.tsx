import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateServiceSchema } from "../../schemas";
import { useUpdateService, useUploadThumbnail } from "../../hooks/useAdminServices";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UpdateServiceFuncArgs, Service } from "../../types";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

// Quick check: Switch component might be missing fromshadcn. I'll stick to a simple checkbox or select if needed, or implement Switch.
// I'll assume Switch exists in shadcn/ui but I haven't checked. 
// Actually, I'll use a Checkbox for booleans to be safe as I didn't create Switch.
// Quick check: Switch component might be missing fromshadcn. I'll stick to a simple checkbox or select if needed, or implement Switch.
// I'll assume Switch exists in shadcn/ui but I haven't checked. 
// Actually, I'll use a Checkbox for booleans to be safe as I didn't create Switch.

// If Checkbox doesn't exist, I'll use a simple native input type="checkbox" styled.
// Let's create a definition for Checkbox if used? No, I'll just use native input with Label for simplicity as allowed "production-ready code only" often implies using available UI kit, but I can fallback.
// Actually, creating a simple Checkbox component is better. But for now invalidating risk, I'll use a Select for boolean (True/False) or native checkbox.
// The schema preprocesses strings "true"/"false", so Select is safer if I don't trust checkbox state binding perfectly without a component.

interface EditServiceModalProps {
    service: Service | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditServiceModal({ service, open, onOpenChange }: EditServiceModalProps) {
    const { mutate: updateService, isPending: isUpdating } = useUpdateService();
    // const { mutate: uploadParams } = useUploadThumbnail(); // Hook logic might be needed for separate upload or integrated.
    // The requirement says "Submit using multipart/form-data" for thumbnail. Frontend req: File input in Edit form.
    // Backend supports multer. "Field name must be thumbnail".
    // I can stick to a separate upload action or part of the edit flow.
    // Usually editing fields is PATCH (json) and file is separate POST/PUT (multipart).
    // Prompt says "Thumbnail upload... Frontend requirements: File input in Edit form... Submit using multipart/form-data".
    // It implies a separate request or a unified one. Given my API structure `uploadThumbnail`, I'll handle it separately or sequentially.
    const { mutateAsync: uploadThumbnail, isPending: isUploading } = useUploadThumbnail();

    const form = useForm<UpdateServiceFuncArgs>({
        resolver: zodResolver(UpdateServiceSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            category: "",
            pricePerDay: 1,
            isActive: true,
            isArchived: false,
        },
    });

    useEffect(() => {
        if (service) {
            form.reset({
                title: service.title,
                description: service.description,
                category: service.category,
                pricePerDay: service.pricePerDay,
                location: service.location,
                contact: service.contact,
                isActive: service.isActive,
                isArchived: service.isArchived,
            });
        }
    }, [service, form]);

    const onSubmit = async (data: UpdateServiceFuncArgs) => {
        if (!service || (!service.id && !service._id)) return;
        const id = service.id || service._id || "";

        // 1. Update text fields
        updateService({ id, data }, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && service) {
            const id = service.id || service._id;
            if (!id) return;

            const file = e.target.files[0];
            try {
                await uploadThumbnail({ id, file });
                // Automatically refetch/refresh context logic handles in hook
            } catch (error) {
                console.error("Upload failed", error);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Service</DialogTitle>
                    <DialogDescription>
                        Update service details.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thumbnail Upload Section */}
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                        <div className="flex-shrink-0 w-20 h-20 bg-muted rounded overflow-hidden border">
                            {service?.thumbnail ? (
                                <img src={service.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full text-xs text-muted-foreground">No Img</div>
                            )}
                        </div>
                        <div className="space-y-1 flex-1">
                            <Label htmlFor="thumbnail" className="font-semibold">Update Thumbnail</Label>
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            <p className="text-xs text-muted-foreground">Recommended: 16:9 aspect ratio</p>
                        </div>
                        {isUploading && <Loader2 className="animate-spin h-5 w-5 text-primary" />}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="venue">Venue</SelectItem>
                                                            <SelectItem value="catering">Catering</SelectItem>
                                                            <SelectItem value="photography">Photography</SelectItem>
                                                            <SelectItem value="decoration">Decoration</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricePerDay"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price / Day</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Status Toggles */}
                                <div className="flex gap-6 md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                </FormControl>
                                                <FormLabel>Is Active?</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isArchived"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                </FormControl>
                                                <FormLabel>Archived</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
