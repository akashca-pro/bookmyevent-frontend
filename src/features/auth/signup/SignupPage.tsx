import { useState } from "react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { AnimatedInput } from "../../../components/shared/AnimatedInput";
import { NeonButton } from "../../../components/shared/NeonButton";
import { Link, useBlocker } from "react-router-dom";

export const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const isDirty = name.length > 0 || email.length > 0 || password.length > 0;

    // Prevent navigation if form is dirty
    useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty && currentLocation.pathname !== nextLocation.pathname && !window.confirm("You have unsaved changes. Are you sure you want to leave?")
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};
        if (!name) newErrors.name = "Full Name is required";
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert("Signup successful (Simulated)");
        }, 2000);
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join the future of event management">
            <form onSubmit={handleSubmit}>
                <AnimatedInput
                    id="name"
                    label="Full Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    error={errors.name}
                />
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

                <NeonButton type="submit" className="w-full mt-4" isLoading={isLoading}>
                    Create Account
                </NeonButton>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-white font-medium hover:text-neon-blue transition-colors">
                        Sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};
