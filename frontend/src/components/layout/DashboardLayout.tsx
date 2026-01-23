import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-muted/40 font-sans">
            <div className="hidden border-r bg-background md:block w-64 fixed h-full z-40">
                <Sidebar className="h-full" />
            </div>
            <div className="flex flex-col flex-1 md:pl-64">
                <Header />
                <main className="flex-1 p-6 md:p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
