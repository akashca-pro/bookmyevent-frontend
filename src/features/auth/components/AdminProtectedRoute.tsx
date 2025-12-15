import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

export const AdminProtectedRoute = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user?.role !== 'admin') {
        if (user?.role === 'user') {
            return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
