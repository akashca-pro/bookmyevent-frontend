
import { useState } from "react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { AnimatedInput } from "../../../components/shared/AnimatedInput";
import { NeonButton } from "../../../components/shared/NeonButton";
import { Link, useNavigate } from "react-router-dom";
import { useDirtyBlocker } from "@/components/shared/useDirtyBlocker";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginSuccess } from "@/store/slices/auth.slice";
import { signup, SignupSchema } from "../api/auth";
import { toast } from "sonner";

export const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isDirty = name.length > 0 || email.length > 0 || password.length > 0;


    useDirtyBlocker(isDirty);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});


        const result = SignupSchema.safeParse({ name, email, password });
        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0] === 'name') fieldErrors.name = issue.message;
                if (issue.path[0] === 'email') fieldErrors.email = issue.message;
                if (issue.path[0] === 'password') fieldErrors.password = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await signup({ name, email, password });

            if (response.success) {
                dispatch(loginSuccess(response.data));
                toast.success(response.message || "Account created successfully!");
                navigate("/");
            }
        } catch (error: any) {
            console.error("Signup error:", error);
            if (error.details && Array.isArray(error.details)) {
                error.details.forEach((err: any) => {
                    toast.error(err.message || "Validation Error", {
                        description: `Field: ${err.field}`
                    });
                });
            } else {
                toast.error(error.message || "Signup failed");
            }
        } finally {
            setIsLoading(false);
        }
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

