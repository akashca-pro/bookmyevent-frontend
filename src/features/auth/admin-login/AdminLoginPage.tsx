import { useState } from "react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { AnimatedInput } from "../../../components/shared/AnimatedInput";
import { NeonButton } from "../../../components/shared/NeonButton";
import { Link, useNavigate } from "react-router-dom";
import { useDirtyBlocker } from "@/components/shared/useDirtyBlocker";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginSuccess } from "@/store/slices/auth.slice";
import { adminLogin, LoginSchema } from "../api/auth";
import { toast } from "sonner";

export const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isDirty = email.length > 0 || password.length > 0;

    useDirtyBlocker(isDirty);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Client-side validation using Zod schema
        const result = LoginSchema.safeParse({ email, password });
        if (!result.success) {
            const fieldErrors: { email?: string; password?: string } = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0] === 'email') fieldErrors.email = issue.message;
                if (issue.path[0] === 'password') fieldErrors.password = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await adminLogin({ email, password });

            if (response.success) {
                dispatch(loginSuccess(response.data));
                toast.success(response.message || "Welcome back, Admin!");
                navigate("/admin/services");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            if (error.details && Array.isArray(error.details)) {
                error.details.forEach((err: any) => {
                    toast.error(err.message || "Validation Error", {
                        description: `Field: ${err.field}`
                    });
                });
            } else {
                toast.error(error.message || "Login failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Admin Portal" subtitle="Restricted access only">
            <form onSubmit={handleSubmit}>
                <AnimatedInput
                    id="admin-email"
                    label="Admin Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    error={errors.email}
                    className="border-neon-green/30 focus:border-neon-green focus:ring-neon-green/50"
                />
                <AnimatedInput
                    id="admin-password"
                    label="Password"
                    isPassword
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    error={errors.password}
                    className="border-neon-green/30 focus:border-neon-green focus:ring-neon-green/50"
                />

                <NeonButton
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-neon-green hover:shadow-[0_0_20px_rgba(10,255,104,0.5)]"
                    isLoading={isLoading}
                >
                    Access Dashboard
                </NeonButton>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <Link to="/login" className="text-gray-400 font-medium hover:text-white transition-colors">
                        Return to User Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};
