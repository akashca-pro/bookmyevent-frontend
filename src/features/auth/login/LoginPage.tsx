import { memo, useCallback, useState } from "react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { AnimatedInput } from "../../../components/shared/AnimatedInput";
import { NeonButton } from "../../../components/shared/NeonButton";
import { Link, useNavigate } from "react-router-dom";
import { useDirtyBlocker } from "@/components/shared/useDirtyBlocker";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginSuccess } from "@/store/slices/auth.slice";
import { userLogin, LoginSchema } from "../api/auth";
import { toast } from "sonner";

const LoginPageComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isDirty = email.length > 0 || password.length > 0;
    useDirtyBlocker(isDirty);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = LoginSchema.safeParse({ email, password });
        if (!result.success) {
            const fieldErrors: { email?: string; password?: string } = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0] === "email") fieldErrors.email = issue.message;
                if (issue.path[0] === "password") fieldErrors.password = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await userLogin({ email, password });
            if (response.success) {
                dispatch(loginSuccess(response.data));
                toast.success(response.message || "Login successful!");
                navigate("/");
            }
        } catch (error: any) {
            if (error.details && Array.isArray(error.details)) {
                error.details.forEach((err: any) => {
                    toast.error(err.message || "Validation Error", { description: `Field: ${err.field}` });
                });
            } else {
                toast.error(error.message || "Login failed");
            }
        } finally {
            setIsLoading(false);
        }
    }, [email, password, dispatch, navigate]);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors(prev => ({ ...prev, email: undefined }));
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setErrors(prev => ({ ...prev, password: undefined }));
    }, []);

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to access your account">
            <form onSubmit={handleSubmit}>
                <AnimatedInput
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    error={errors.email}
                />
                <AnimatedInput
                    id="password"
                    label="Password"
                    isPassword
                    value={password}
                    onChange={handlePasswordChange}
                    error={errors.password}
                />
                <div className="flex justify-end mb-6">
                    <Link to="#" className="text-sm text-neon-blue hover:text-neon-purple transition-colors">
                        Forgot password?
                    </Link>
                </div>
                <NeonButton type="submit" className="w-full" isLoading={isLoading}>
                    Sign In
                </NeonButton>
                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-white font-medium hover:text-neon-blue transition-colors">
                        Sign up
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export const LoginPage = memo(LoginPageComponent);
