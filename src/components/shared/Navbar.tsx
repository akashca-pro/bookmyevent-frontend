import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { NeonButton } from "./NeonButton";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isAuthPage = ["/login", "/signup", "/admin/login"].includes(location.pathname);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isAuthPage) return null;

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-black/50 backdrop-blur-lg border-b border-white/10 py-4" : "bg-transparent py-6"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                <Link to="/">
                    <Logo />
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                        Services
                    </Link>
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                        How it works
                    </Link>
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                        About
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <NeonButton variant="outline" className="px-4 py-2 text-sm">
                            Login
                        </NeonButton>
                    </Link>
                    <Link to="/signup">
                        <NeonButton className="px-4 py-2 text-sm">
                            Get Started
                        </NeonButton>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
};
