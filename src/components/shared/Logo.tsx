import { memo } from "react";
import { motion } from "framer-motion";

interface LogoProps {
    className?: string;
}

const LogoComponent = ({ className }: LogoProps) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-8 h-8 flex items-center justify-center will-change-transform"
                style={{ transform: "translateZ(0)" }}
            >
                <div className="absolute inset-0 border-2 border-neon-blue rounded-full border-t-transparent" />
                <div className="absolute inset-1 border-2 border-neon-purple rounded-full border-b-transparent" />
            </motion.div>
            <span className="font-bold text-xl tracking-tight text-white">
                BookMy<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Event</span>
            </span>
        </div>
    );
};

export const Logo = memo(LogoComponent);
