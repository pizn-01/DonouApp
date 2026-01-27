import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setShowUserMenu(false);
        await logout();
        navigate("/auth/login");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 bg-background/95 border-b px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex-1">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search briefs, manufacturers..."
                        className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 rounded-full transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border-2 border-background" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>

                <div className="relative" ref={menuRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-muted/50 h-9 w-9 border border-border/50 hover:bg-muted transition-colors overflow-hidden"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-5 w-5 text-foreground/80" />
                        )}
                        <span className="sr-only">Toggle user menu</span>
                    </Button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-2 border-b">
                                <p className="text-sm font-medium px-2 pt-1">{user?.full_name || 'User'}</p>
                                <p className="text-xs text-muted-foreground px-2 pb-1 truncate">{user?.email}</p>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={() => { setShowUserMenu(false); navigate("/settings"); }}
                                    className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground text-left"
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-destructive/10 hover:text-destructive text-left transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
