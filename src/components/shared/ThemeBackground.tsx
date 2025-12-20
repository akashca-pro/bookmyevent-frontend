import { memo } from "react";
import { motion } from "framer-motion";

const ThemeBackgroundComponent = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black" />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px] will-change-transform"
                style={{ transform: "translateZ(0)" }}
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[128px] will-change-transform"
                style={{ transform: "translateZ(0)" }}
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
        </div>
    );
};

export const ThemeBackground = memo(ThemeBackgroundComponent);
