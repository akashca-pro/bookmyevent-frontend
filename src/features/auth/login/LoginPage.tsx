import { useState } from "react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { AnimatedInput } from "../../../components/shared/AnimatedInput";
import { NeonButton } from "../../../components/shared/NeonButton";
import { Link } from "react-router-dom";
import { useDirtyBlocker } from "@/components/shared/useDirtyBlocker";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const isDirty = email.length > 0 || password.length > 0;

    useDirtyBlocker(isDirty);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert("Login successful (Simulated)");
        }, 2000);
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to access your account">
            <form onSubmit={handleSubmit}>
                <AnimatedInput
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    error={errors.email}
                />
                <AnimatedInput
                    id="password"
                    label="Password"
                    isPassword
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
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
