import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileText, Package, CheckCircle, Clock, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/manufacturer/StatCard';
import { briefService, type Brief } from '@/services/brief.service';

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export default function BrandDashboardPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [recentBriefs, setRecentBriefs] = useState<Brief[]>([]);
    const [stats, setStats] = useState({
        totalBriefs: 0,
        activeBriefs: 0,
        pendingProposals: 0,
        acceptedProposals: 0
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                // Fetch Stats
                const statsData = await briefService.getBrandStats();
                setStats(statsData);

                // Fetch Recent Briefs (limit 5)
                const briefsResponse = await briefService.getAll({ limit: 5 });
                setRecentBriefs(briefsResponse.data);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header covering active task */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Brand Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your briefs and proposals</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/briefs/create-ai')}
                            className="gap-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                        >
                            <Sparkles className="h-4 w-4" />
                            Create with AI
                        </Button>
                        <Button
                            onClick={() => navigate('/briefs/create')}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            New Brief
                        </Button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Briefs"
                        value={stats.totalBriefs}
                        icon={<FileText />}
                        iconBgColor="bg-blue-50"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        label="Active Briefs"
                        value={stats.activeBriefs}
                        icon={<Clock />}
                        iconBgColor="bg-green-50"
                        iconColor="text-green-600"
                    />
                    <StatCard
                        label="Pending Proposals"
                        value={stats.pendingProposals}
                        icon={<Package />}
                        iconBgColor="bg-orange-50"
                        iconColor="text-orange-600"
                    />
                    <StatCard
                        label="Accepted"
                        value={stats.acceptedProposals}
                        icon={<CheckCircle />}
                        iconBgColor="bg-purple-50"
                        iconColor="text-purple-600"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Briefs */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Briefs</h2>
                            <Button variant="link" onClick={() => navigate('/briefs')}>View All</Button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-10">Loading briefs...</div>
                        ) : recentBriefs.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg border border-gray-200 text-gray-500">
                                No briefs created yet. Start by creating a new brief!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentBriefs.map((brief) => (
                                    <div
                                        key={brief.id}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/briefs/${brief.id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{brief.title}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <span>{brief.id.substring(0, 8)}...</span>
                                                    <span>•</span>
                                                    <span>{timeAgo(brief.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">0 Proposals</div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                                    ${brief.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {brief.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions / Recent Activity */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start h-auto py-3 px-4"
                                onClick={() => navigate('/briefs/create')}
                            >
                                <div className="bg-blue-50 p-2 rounded-md mr-3">
                                    <Plus className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Create New Brief</div>
                                    <div className="text-xs text-gray-500">Start from scratch</div>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-start h-auto py-3 px-4"
                                onClick={() => navigate('/briefs/create-ai')}
                            >
                                <div className="bg-indigo-50 p-2 rounded-md mr-3">
                                    <Sparkles className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">AI Brief Assistant</div>
                                    <div className="text-xs text-gray-500">Generate with AI</div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
