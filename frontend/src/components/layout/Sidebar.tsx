import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Settings,
    LogOut
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation();

    const mainNav = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "My Briefs",
            href: "/briefs",
            icon: FileText,
        },
        {
            title: "Messages",
            href: "/messages",
            icon: MessageSquare,
        },
        {
            title: "Settings",
            href: "/settings",
            icon: Settings,
        },
    ];

    return (
        <div className={cn("pb-12 h-screen border-r bg-card", className)}>
            <div className="space-y-4 py-4">
                <div className="px-6 py-2">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="font-bold text-primary-foreground text-xl">D</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">DonauApp</span>
                    </Link>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {mainNav.map((item) => {
                            const isActive = location.pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 w-full px-6">
                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors w-full">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
