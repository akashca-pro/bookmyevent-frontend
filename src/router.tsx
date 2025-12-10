import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./features/layouts/RootLayout";
import { LandingPage } from "./features/landing/pages/LandingPage";
import { LoginPage } from "./features/auth/login/LoginPage";
import { SignupPage } from "./features/auth/signup/SignupPage";
import { AdminLoginPage } from "./features/auth/admin-login/AdminLoginPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
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
]);
