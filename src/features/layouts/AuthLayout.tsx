import type { ReactNode } from "react";
import { GlassCard } from "../../components/shared/GlassCard";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../components/shared/Logo";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    const location = useLocation();
    const isAdmin = location.pathname.includes("admin");

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="flex justify-center mb-8">
                    <Link to="/">
                        <Logo className="scale-125" />
                    </Link>
                </div>

                <GlassCard className={`border-t-4 ${isAdmin ? 'border-t-neon-green' : 'border-t-neon-purple'}`}>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                            {title}
                        </h1>
                        <p className="text-gray-400">{subtitle}</p>
                    </div>
                    {children}
                </GlassCard>

                <div className="mt-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} BookMyEvent. All rights reserved.
                </div>
            </motion.div>
        </div>
    );
};
