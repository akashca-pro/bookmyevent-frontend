import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";

interface CountdownTimerProps {
    initialTimeSeconds?: number;
    onTimeout: () => void;
}

export function CountdownTimer({ initialTimeSeconds = 300, onTimeout }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialTimeSeconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeout();
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onTimeout]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isUrgent = timeLeft < 60;

    return (
        <div
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border bg-background transition-colors duration-500",
                isUrgent ? "border-destructive/50 text-destructive bg-destructive/10 animate-pulse" : "border-border"
            )}
        >
            <Timer className="h-4 w-4" />
            <span className="font-mono font-bold text-lg">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
        </div>
    );
}
