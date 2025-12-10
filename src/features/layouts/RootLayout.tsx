import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/shared/Navbar";
import { ThemeBackground } from "../../components/shared/ThemeBackground";

export const RootLayout = () => {
    return (
        <div className="min-h-screen text-foreground font-sans selection:bg-neon-purple/30 selection:text-white">
            <ThemeBackground />
            <Navbar />
            <main className="relative z-10">
                <Outlet />
            </main>
        </div>
    );
};
