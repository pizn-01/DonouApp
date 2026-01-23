// Link removed
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter your credentials to access your account"
        >
            <div className="grid gap-6">
                <LoginForm />
            </div>
        </AuthLayout>
    );
}
