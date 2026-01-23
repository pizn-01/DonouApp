import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout
            title="Login to DonauApp"
            subtitle="Enter your email below to login to your account"
        >
            <div className="grid gap-6">
                <LoginForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        to="/auth/register"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Don&apos;t have an account? Sign Up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
