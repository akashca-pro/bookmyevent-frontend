import { createBrowserRouter } from "react-router-dom";
import { ErrorElement } from "./components/shared/ErrorElement";
import { RootLayout } from "./features/layouts/RootLayout";
import { LandingPage } from "./features/landing/pages/LandingPage";
import { LoginPage } from "./features/auth/login/LoginPage";
import { SignupPage } from "./features/auth/signup/SignupPage";
import { AdminLoginPage } from "./features/auth/admin-login/AdminLoginPage";


import ExplorePage from "./features/explore/components/ExplorePage";
import { ServiceDetailsPage } from "./features/explore/pages/ServiceDetailsPage";

import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import ServiceBookingsPage from "./features/admin/pages/ServiceBookingsPage";
import { AdminProtectedRoute } from "./features/auth/components/AdminProtectedRoute";
import { UserProtectedRoute } from "./features/auth/components/UserProtectedRoute";
import { PublicOnlyRoute } from "./features/auth/components/PublicOnlyRoute";
import UserDashboardPage from "./features/dashboard/pages/UserDashboardPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import { BookingConfirmationPage } from "./features/bookings/components/BookingConfirmationPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorElement />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                element: <PublicOnlyRoute />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "signup",
                        element: <SignupPage />,
                    },
                    {
                        path: "admin/login",
                        element: <AdminLoginPage />,
                    },
                ],
            },
            {
                element: <AdminProtectedRoute />,
                children: [
                    {
                        path: "admin/dashboard",
                        element: <AdminDashboardPage />,
                    },
                    {
                        path: "admin/profile",
                        element: <ProfilePage />,
                    },
                    {
                        path: "admin/services/:id/bookings",
                        element: <ServiceBookingsPage />,
                    },
                ],
            },
            {
                element: <UserProtectedRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: <UserDashboardPage />,
                    },
                    {
                        path: "profile",
                        element: <ProfilePage />,
                    },
                    {
                        path: "services/:id/confirm-booking",
                        element: <BookingConfirmationPage />,
                    },
                ],
            },
            {
                path: "explore",
                element: <ExplorePage />,
            },
            {
                path: "services/:id",
                element: <ServiceDetailsPage />,
            },
        ],
    },
]);
