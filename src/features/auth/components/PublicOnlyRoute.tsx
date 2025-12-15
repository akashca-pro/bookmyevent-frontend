import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

export const PublicOnlyRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
