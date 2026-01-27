import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BrandAIChat } from "../BrandAIChat";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useAuth();
    const isBrand = user?.role === 'brand';

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <div className="hidden border-r bg-white md:block w-64 fixed h-full z-40">
                <Sidebar className="h-full" />
            </div>
            <div className="flex flex-col flex-1 md:pl-64">
                <Header />
                <main className="flex-1 p-6 md:p-8 pt-6">
                    {children}
                </main>
            </div>
            {isBrand && <BrandAIChat />}
        </div>
    );
}
