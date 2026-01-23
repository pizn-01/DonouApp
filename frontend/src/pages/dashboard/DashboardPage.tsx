import { ArrowUpRight, Clock, FileText, CheckCircle, TrendingUp, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";

// Mock data (matches backend structure)
const STATS = [
    {
        title: "Active Briefs",
        value: "12",
        change: "+2 from last month",
        icon: FileText,
        trend: "up",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "Pending Proposals",
        value: "4",
        change: "Requires attention",
        icon: Clock,
        trend: "down",
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        title: "Active Matches",
        value: "8",
        change: "Across 3 projects",
        icon: TrendingUp,
        trend: "up",
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        title: "Completed Projects",
        value: "24",
        change: "Since joining",
        icon: CheckCircle,
        trend: "neutral",
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
];

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Overview of your manufacturing briefs and proposals.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button>Create Brief</Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {STATS.map((stat) => (
                        <Card key={stat.title} className="hover:shadow-md transition-all duration-200 border-muted">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    <Card className="col-span-4 border-muted hover:shadow-md transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-4 border-b pb-6 last:border-0 last:pb-0 group">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                                Brief "Sustainable Packaging" Updated
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Added new material requirements for the eco-friendly line.
                                            </p>
                                            <p className="text-xs text-muted-foreground pt-1">
                                                2 hours ago
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3 border-muted hover:shadow-md transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <button className="w-full text-left px-4 py-4 rounded-lg bg-muted/30 hover:bg-muted font-medium text-sm transition-all border border-transparent hover:border-border flex items-center justify-between group">
                                <span className="font-semibold text-foreground">Create New Brief</span>
                                <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>
                            <button className="w-full text-left px-4 py-4 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 font-medium text-sm transition-all border border-indigo-100/50 hover:border-indigo-200 flex items-center justify-between group">
                                <span className="font-semibold text-indigo-700">Generate with AI</span>
                                <ArrowUpRight className="h-4 w-4 text-indigo-600 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>
                            <button className="w-full text-left px-4 py-4 rounded-lg bg-muted/30 hover:bg-muted font-medium text-sm transition-all border border-transparent hover:border-border flex items-center justify-between group">
                                <span className="font-semibold text-foreground">View Pending Proposals</span>
                                <div className="flex items-center gap-2">
                                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">4</span>
                                    <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
