import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesTab } from "../components/tabs/ServicesTab";
import { CategoriesTab } from "../components/tabs/CategoriesTab";

export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto px-6 pb-6 pt-24 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            </div>

            <Tabs defaultValue="services" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-6">
                    <ServicesTab />
                </TabsContent>

                <TabsContent value="categories" className="space-y-6">
                    <CategoriesTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

