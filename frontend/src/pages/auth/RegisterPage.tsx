
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/features/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start connecting with trusted partners today"
        >
            <div className="grid gap-6">
                <RegisterForm />
            </div>
        </AuthLayout>
    );
}
