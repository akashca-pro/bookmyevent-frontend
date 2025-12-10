
import { useState } from "react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { AnimatedInput } from "../../../components/shared/AnimatedInput";
import { NeonButton } from "../../../components/shared/NeonButton";
import { Link } from "react-router-dom";
import { useDirtyBlocker } from "@/components/shared/useDirtyBlocker";

export const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const isDirty = email.length > 0 || password.length > 0;

    useDirtyBlocker(isDirty);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = "Admin Email is required";
        if (!password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert("Admin Login successful (Simulated)");
        }, 2000);
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
