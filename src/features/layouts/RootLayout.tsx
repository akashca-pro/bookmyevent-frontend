import { memo, useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/shared/Navbar";
import { ThemeBackground } from "../../components/shared/ThemeBackground";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getCurrentUser } from "../auth/api/auth";
import { loginSuccess, logout } from "@/store/slices/auth.slice";
import { Loader2 } from "lucide-react";

const RootLayoutComponent = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [isChecking, setIsChecking] = useState(!isAuthenticated);

    const checkSession = useCallback(async () => {
        if (!isAuthenticated) {
            try {
                const response = await getCurrentUser();
                if (response.success && response.data) {
                    dispatch(loginSuccess(response.data));
                }
            } catch {
                dispatch(logout());
            } finally {
                setIsChecking(false);
            }
        } else {
            setIsChecking(false);
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
        );
    }

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

export const RootLayout = memo(RootLayoutComponent);
