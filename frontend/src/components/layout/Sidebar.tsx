import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    Search
} from "lucide-react";
import logo from "@/assets/Group 1597890163 (3).png";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/auth/login');
    };

    const brandNav = [
        {
            title: "Dashboard",
            href: "/brand/dashboard",
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

    const manufacturerNav = [
        {
            title: "Dashboard",
            href: "/manufacturer/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Find Briefs",
            href: "/manufacturer/marketplace",
            icon: Search,
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

    const navItems = user?.role === 'manufacturer' ? manufacturerNav : brandNav;
    const homeLink = user?.role === 'manufacturer' ? '/manufacturer/dashboard' : '/dashboard';

    return (
        <div className={cn("pb-12 h-screen border-r bg-card", className)}>
            <div className="space-y-4 py-4">
                <div className="px-6 py-2">
                    <Link to={homeLink} className="flex items-center gap-2">
                        <img src={logo} alt="Donau.ai Logo" className="h-10 w-auto" />
                    </Link>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {navItems.map((item) => {
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
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors w-full"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
