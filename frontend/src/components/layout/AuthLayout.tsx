import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/Group 1597890163 (3).png";

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col relative w-full">
            {/* Header */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-100">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Donau.ai Logo" className="h-8 w-auto" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        🇬🇧 English <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <Card className="w-full max-w-[500px] shadow-2xl border-0 sm:rounded-3xl overflow-hidden bg-card">
                    <CardContent className="p-8 sm:p-12 space-y-8">
                        <div className="text-center space-y-2">
                            {title && (
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="text-muted-foreground text-sm">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {children}
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="p-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-4 container mx-auto">
                <p>&copy; 2026 DonauAI</p>
                <div className="flex gap-6">
                    <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                </div>
            </footer>
        </div>
    );
}
