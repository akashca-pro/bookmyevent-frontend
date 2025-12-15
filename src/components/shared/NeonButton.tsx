import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline";
    isLoading?: boolean;
    glow?: boolean;
}

export const NeonButton = ({
    children,
    className,
    variant = "primary",
    isLoading,
    disabled,
    ...props
}: NeonButtonProps) => {
    const baseStyles = "relative inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] border-0",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-md",
        outline: "bg-transparent text-white border border-neon-blue hover:bg-neon-blue/10 hover:shadow-[0_0_10px_rgba(0,243,255,0.3)]",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {/* Button Shine Effect */}
            {variant === "primary" && (
                <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
            )}

            {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
};
