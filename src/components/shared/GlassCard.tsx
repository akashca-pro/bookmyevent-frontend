import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

const GlassCardComponent = ({ children, className, hoverEffect = true }: GlassCardProps) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0 0 20px rgba(188, 19, 254, 0.3)" } : undefined}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300",
                "shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
                className
            )}
            style={{ transform: "translateZ(0)" }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
            {children}
        </motion.div>
    );
};

export const GlassCard = memo(GlassCardComponent);
