import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/shared/Navbar";
import { ThemeBackground } from "../../components/shared/ThemeBackground";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export const RootLayout = () => {
    return (
        <div className="min-h-screen text-foreground font-sans selection:bg-neon-purple/30 selection:text-white">
            <QueryClientProvider client={queryClient}>
            <Toaster
                position="top-right"
                theme="dark"
                richColors
                duration={4000}
            />
            <ThemeBackground />
            <Navbar />
            <main className="relative z-10">
                <Outlet />
            </main>
            </QueryClientProvider>
        </div>
    );
};
