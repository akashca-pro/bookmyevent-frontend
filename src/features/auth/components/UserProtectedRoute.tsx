import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

export const UserProtectedRoute = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};
