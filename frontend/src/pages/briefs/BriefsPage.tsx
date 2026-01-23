import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    FileText,
    Calendar,
    DollarSign,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BriefStatus, type Brief } from "@/features/briefs/types";
import { cn } from "@/lib/utils";

// Mock data (matches backend structure)
const MOCK_BRIEFS: Brief[] = [];

const StatusBadge = ({ status }: { status: BriefStatus }) => {
    const styles = {
        [BriefStatus.DRAFT]: "bg-gray-100 text-gray-700 border-gray-200",
        [BriefStatus.ACTIVE]: "bg-emerald-50 text-emerald-700 border-emerald-100",
        [BriefStatus.IN_PROGRESS]: "bg-blue-50 text-blue-700 border-blue-100",
        [BriefStatus.COMPLETED]: "bg-purple-50 text-purple-700 border-purple-100",
        [BriefStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-100",
    };

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", styles[status])}>
            {status}
        </span>
    );
};

export default function BriefsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Briefs</h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Manage your manufacturing projects and AI generations.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/briefs/create-ai">
                            <Button variant="outline" className="h-10 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary">
                                <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
                                Spark with AI
                            </Button>
                        </Link>
                        <Link to="/briefs/create">
                            <Button className="h-10 shadow-sm">
                                <Plus className="mr-2 h-4 w-4" />
                                New Brief
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-1 bg-background rounded-lg border shadow-sm max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search briefs by title, category, or status..."
                            className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-px h-6 bg-border" />
                    <Button variant="ghost" size="sm" className="px-3 text-muted-foreground hover:text-foreground">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>

                <div className="grid gap-4">
                    {MOCK_BRIEFS.length === 0 ? (
                        <div className="text-center py-20 border rounded-lg bg-muted/10 border-dashed">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">No briefs yet</h3>
                            <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                                Create your first manufacturing brief to start getting proposals from suppliers.
                            </p>
                            <Link to="/briefs/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create First Brief
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        MOCK_BRIEFS.map((brief) => (
                            <Card key={brief.id} className="group hover:shadow-md transition-all duration-200 border-muted hover:border-primary/20 cursor-pointer">
                                <Link to={`/briefs/${brief.id}`} className="block">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                        {brief.title}
                                                    </h3>
                                                    <StatusBadge status={brief.status} />
                                                    {brief.aiGenerated && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                            <Sparkles className="w-3 h-3 mr-1" />
                                                            AI Generated
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground line-clamp-2 max-w-3xl leading-relaxed">
                                                    {brief.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
                                                    <div className="flex items-center gap-2 bg-muted/40 px-2 py-1 rounded-md">
                                                        <FileText className="h-4 w-4" />
                                                        <span className="font-medium">{brief.category}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{brief.timeline}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4" />
                                                        <span>${brief.budget.min.toLocaleString()} - {brief.budget.max.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2 ml-4">
                                                <Button variant="ghost" size="icon" className="hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                                <span className="text-xs text-muted-foreground mt-auto">
                                                    Updated {new Date(brief.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
