import { getCloudinaryUrl } from "@/utils/cloudinaryImageUrl";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateServiceSchema } from "../../schemas";
import { useUpdateService } from "../../hooks/useAdminServices";
import { useCategoriesOptions } from "@/hooks/useCategoriesOptions";
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


interface EditServiceModalProps {
    service: Service | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditServiceModal({ service, open, onOpenChange }: EditServiceModalProps) {
    const { mutate: updateService, isPending: isUpdating } = useUpdateService();
    const { data: categories } = useCategoriesOptions();

    // State for image handling
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    // Create a stable object URL for the selected file
    const objectUrl = useMemo(() => {
        if (thumbnailFile) return URL.createObjectURL(thumbnailFile);
        return null;
    }, [thumbnailFile]);

    // Cleanup object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [objectUrl]);

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

    const isDeleteThumbnail = form.watch("deleteThumbnail");
    const displayUrl = objectUrl || (isDeleteThumbnail ? null : getCloudinaryUrl(service?.thumbnail));

    useEffect(() => {
        if (service) {
            form.reset({
                title: service.title,
                description: service.description,
                category: service.category.id, // Use ID for form value
                pricePerDay: service.pricePerDay,
                location: service.location,
                contact: service.contact,
                isActive: service.isActive,
                isArchived: service.isArchived,
                availability: {
                    from: new Date(service.availability.from),
                    to: new Date(service.availability.to)
                },
            });
            // Reset local file state when service changes
            setThumbnailFile(null);
        }
    }, [service, form]);

    const onSubmit = async (data: UpdateServiceFuncArgs) => {
        if (!service?.id) return;
        const id = service.id;

        // Combine data with thumbnail file if it exists
        const payload = {
            ...data,
            thumbnail: thumbnailFile || undefined
        };

        updateService({ id, data: payload }, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);
            form.setValue("deleteThumbnail", false);
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
                            {displayUrl ? (
                                <img src={displayUrl} alt="Thumbnail" className="w-full h-full object-cover" />
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
                            />
                            <p className="text-xs text-muted-foreground">Recommended: 16:9 aspect ratio</p>
                        </div>
                        {(displayUrl || thumbnailFile) && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    setThumbnailFile(null);
                                    form.setValue("deleteThumbnail", true, { shouldDirty: true });
                                    // If we are removing a file we just selected, we don't need to prevent display of original if we didn't mean to delete original
                                    // BUT simplifed logic: if we click remove, we remove whatever is currently shown.
                                    // If it was a new file, it clears new file.
                                    // If it was original, it sets deleteThumbnail=true.
                                    // To allow showing original again is complex, let's just assume remove means remove.
                                }}
                            >
                                Remove
                            </Button>
                        )}
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
                                                            {categories?.map((cat) => (
                                                                <SelectItem key={cat.id} value={cat.id}>
                                                                    {cat.label}
                                                                </SelectItem>
                                                            ))}
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

                                {/* Availability */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="font-medium border-b pb-2">Availability</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="availability.from"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Available From</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="availability.to"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Available To</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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
