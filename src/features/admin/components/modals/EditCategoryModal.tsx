import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCategorySchema } from "../../schemas";
import { useAdminCategories } from "../../hooks/useAdminCategories";
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
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Category, UpdateCategoryDTO } from "../../types";
import { Loader2 } from "lucide-react";

interface EditCategoryModalProps {
    category: Category;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditCategoryModal({ category, open, onOpenChange }: EditCategoryModalProps) {
    const { updateCategory, isUpdating } = useAdminCategories();

    const form = useForm<UpdateCategoryDTO>({
        resolver: zodResolver(UpdateCategorySchema) as any,
        defaultValues: {
            name: category.name,
            slug: category.slug,
            description: category.description,
            isActive: category.isActive,
            isArchived: category.isArchived,
        },
    });

    // Reset form when service changes
    useEffect(() => {
        if (open && category) {
            form.reset({
                name: category.name,
                slug: category.slug,
                description: category.description,
                isActive: category.isActive,
                isArchived: category.isArchived,
            });
        }
    }, [category, open, form]);

    const onSubmit = (data: UpdateCategoryDTO) => {
        updateCategory(
            { id: category.id!, data },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Update category details, status, or archive settings.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="category-slug" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe this category..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Active Status</FormLabel>
                                <FormDescription>
                                    Visible to users when active.
                                </FormDescription>
                            </div>
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-row items-center justify-between rounded-lg border border-red-200 bg-red-50/50 p-3 shadow-sm dark:border-red-900/50 dark:bg-red-900/10">
                            <div className="space-y-0.5">
                                <FormLabel className="text-destructive">Archive Category</FormLabel>
                                <FormDescription className="text-destructive/80">
                                    Hide from all lists but keep data.
                                </FormDescription>
                            </div>
                            <FormField
                                control={form.control}
                                name="isArchived"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Category
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
