import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/features/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthLayout
            title="Create an account"
            subtitle="Enter your email below to create your account"
        >
            <div className="grid gap-6">
                <RegisterForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        to="/auth/login"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Already have an account? Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
