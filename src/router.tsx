import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorElement } from "./components/shared/ErrorElement";
import { RootLayout } from "./features/layouts/RootLayout";
import { AdminProtectedRoute } from "./features/auth/components/AdminProtectedRoute";
import { UserProtectedRoute } from "./features/auth/components/UserProtectedRoute";
import { PublicOnlyRoute } from "./features/auth/components/PublicOnlyRoute";
import { Loader2 } from "lucide-react";

const LandingPage = lazy(() => import("./features/landing/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("./features/auth/login/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("./features/auth/signup/SignupPage").then(m => ({ default: m.SignupPage })));
const AdminLoginPage = lazy(() => import("./features/auth/admin-login/AdminLoginPage").then(m => ({ default: m.AdminLoginPage })));
const ExplorePage = lazy(() => import("./features/explore/components/ExplorePage"));
const ServiceDetailsPage = lazy(() => import("./features/explore/pages/ServiceDetailsPage").then(m => ({ default: m.ServiceDetailsPage })));
const AdminDashboardPage = lazy(() => import("./features/admin/pages/AdminDashboardPage"));
const ServiceBookingsPage = lazy(() => import("./features/admin/pages/ServiceBookingsPage"));
const UserDashboardPage = lazy(() => import("./features/dashboard/pages/UserDashboardPage"));
const ProfilePage = lazy(() => import("./features/profile/pages/ProfilePage"));
const BookingConfirmationPage = lazy(() => import("./features/bookings/components/BookingConfirmationPage").then(m => ({ default: m.BookingConfirmationPage })));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
    </div>
);

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorElement />,
        children: [
            {
                index: true,
                element: withSuspense(LandingPage),
            },
            {
                element: <PublicOnlyRoute />,
                children: [
                    {
                        path: "login",
                        element: withSuspense(LoginPage),
                    },
                    {
                        path: "signup",
                        element: withSuspense(SignupPage),
                    },
                    {
                        path: "admin/login",
                        element: withSuspense(AdminLoginPage),
                    },
                ],
            },
            {
                element: <AdminProtectedRoute />,
                children: [
                    {
                        path: "admin/dashboard",
                        element: withSuspense(AdminDashboardPage),
                    },
                    {
                        path: "admin/profile",
                        element: withSuspense(ProfilePage),
                    },
                    {
                        path: "admin/services/:id/bookings",
                        element: withSuspense(ServiceBookingsPage),
                    },
                ],
            },
            {
                element: <UserProtectedRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: withSuspense(UserDashboardPage),
                    },
                    {
                        path: "profile",
                        element: withSuspense(ProfilePage),
                    },
                    {
                        path: "services/:id/confirm-booking",
                        element: withSuspense(BookingConfirmationPage),
                    },
                ],
            },
            {
                path: "explore",
                element: withSuspense(ExplorePage),
            },
            {
                path: "services/:id",
                element: withSuspense(ServiceDetailsPage),
            },
        ],
    },
]);
