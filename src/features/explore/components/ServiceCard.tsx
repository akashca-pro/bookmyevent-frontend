import type { GetAvailableServicesResponseDTO } from "../types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getCloudinaryUrl } from "@/utils/cloudinaryImageUrl";

// I'll create a simple Badge inline or just use standard classes since I missed creating it.
// I'll just use a styled span for now to ensure I don't break flow.

interface ServiceCardProps {
    service: GetAvailableServicesResponseDTO;
    index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
    const imageUrl = getCloudinaryUrl(service.thumbnail);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
        >
            <Card className="h-full overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={service.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            <span className="text-sm">No Image</span>
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            {service.category}
                        </span>
                    </div>
                </div>

                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {service.city ? `${service.city}` : "Location available upon request"}
                    </p>
                </CardContent>

                <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Price per day</span>
                        <span className="font-medium text-primary">
                            ₹{service.pricePerDay.toLocaleString()}
                        </span>
                    </div>
                    {/* Action hint could go here */}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
