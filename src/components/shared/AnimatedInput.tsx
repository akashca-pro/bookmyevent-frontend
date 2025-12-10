import { type InputHTMLAttributes, useState } from "react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    isPassword?: boolean;
}

export const AnimatedInput = ({
    label,
    className,
    error,
    isPassword,
    id,
    type = "text",
    ...props
}: AnimatedInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [, setValue] = useState(props.value || "");

    // Handle controlled vs uncontrolled
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        props.onChange?.(e);
    };

    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="relative mb-6">
            <div className="relative">
                <input
                    id={id}
                    type={currentType}
                    className={cn(
                        "peer w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-transparent focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue/50 transition-all duration-300",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
                        className
                    )}
                    placeholder={label}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    onChange={handleChange}
                    value={props.value}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-4 top-3 text-gray-400 transition-all duration-300 pointer-events-none",
                        "peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-neon-blue",
                        (props.value || isFocused) && "-top-6 text-xs text-neon-blue"
                    )}
                >
                    {label}
                </label>

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-5 left-0 text-xs text-red-500"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};
