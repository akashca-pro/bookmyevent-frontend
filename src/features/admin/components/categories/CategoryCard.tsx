import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Clock, CalendarDays } from "lucide-react";
import type { Category } from "../../types";

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
}

export function CategoryCard({ category, onEdit }: CategoryCardProps) {
    return (
        <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-white/10 hover:border-neon-purple/50 transition-all duration-300">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold truncate">{category.name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground font-mono">
                            /{category.slug}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {category.isArchived && <Badge variant="destructive">Archived</Badge>}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {category.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated {new Date(category.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full hover:text-neon-purple hover:bg-neon-purple/10"
                    onClick={() => onEdit(category)}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Category
                </Button>
            </CardFooter>
        </Card>
    );
}
