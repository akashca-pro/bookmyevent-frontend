import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { NeonButton } from "./NeonButton";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout as logoutAction } from "@/store/slices/auth.slice";
import { logout as logoutApi } from "@/features/auth/api/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    // Determine if we should hide navbar elements, e.g. on login page if desired, 
    // but user wanted redirection from login page if auth. 
    // The previous code hid navbar on auth pages. Keeping that logic but checking path.
    const isAuthPage = ["/login", "/signup", "/admin/login"].includes(location.pathname);

    // Normalize role for comparison
    const userRole = user?.role?.toLowerCase();
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setScrolled(window.scrollY > 20);
            }, 10); // Small delay for performance
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logoutApi();
            dispatch(logoutAction());
            queryClient.invalidateQueries();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if API fails, we should probably clear client state
            dispatch(logoutAction());
            navigate("/login");
        }
    };

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
                    <Link
                        to="/explore"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-white",
                            location.pathname === "/explore" ? "text-neon-purple" : "text-gray-300"
                        )}
                    >
                        Explore
                    </Link>
                    {isAuthenticated && (
                        <Link
                            to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-white",
                                [
                                    "/dashboard",
                                    "/admin/dashboard"
                                ].includes(location.pathname)
                                    ? "text-neon-purple"
                                    : "text-gray-300"
                            )}
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>
                <div className="flex items-center gap-4">
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-neon-purple/50">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-black/90 border-white/10 text-white backdrop-blur-xl" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                                        <p className="text-xs leading-none text-gray-400">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                                    <Link to={isAdmin ? "/admin/profile" : "/profile"}>
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                                    <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </motion.header>
    );
};
