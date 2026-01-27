import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Clock, FileText, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/manufacturer/StatCard';

export default function ManufacturerDashboardPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalBrief: 0, newBrief: 0, activeBrief: 0 });
    const [recentBriefs, setRecentBriefs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Parallel fetch for proposals and matches
                const [proposalsRes, matchesRes] = await Promise.allSettled([
                    import('../../services/proposal.service').then(({ proposalService }) => proposalService.getMyProposals()),
                    import('../../services/matching.service').then(({ matchingService }) => matchingService.getRecommendations())
                ]);

                let totalProposals = 0;
                let activeProposals = 0;
                let newMatches = 0;
                let briefsList: any[] = [];

                if (proposalsRes.status === 'fulfilled') {
                    const proposals = proposalsRes.value;
                    totalProposals = proposals.length;
                    activeProposals = proposals.filter((p: any) => p.status !== 'REJECTED' && p.status !== 'WITHDRAWN').length;
                }

                if (matchesRes.status === 'fulfilled') {
                    const matches = matchesRes.value.matches || [];
                    newMatches = matches.length;

                    // Map matches to display format
                    briefsList = matches.slice(0, 3).map((match: any) => ({
                        id: match.brief.id,
                        title: match.brief.title,
                        status: 'New Match', // or derive from match score/status
                        description: match.brief.description?.substring(0, 100) + '...',
                        supplements: match.brief.category || 'General',
                        createdDate: new Date(match.brief.created_at).toLocaleDateString(),
                        budget: `${match.brief.currency} ${match.brief.budget_range_min?.toLocaleString()} - ${match.brief.budget_range_max?.toLocaleString()}`
                    }));
                }

                setStats({
                    totalBrief: newMatches, // Using matches as "Available Briefs"
                    newBrief: newMatches,
                    activeBrief: activeProposals
                });
                setRecentBriefs(briefsList);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Mock notifications for now
    const notifications = [
        {
            id: 1,
            title: 'Welcome!',
            message: 'Complete your profile to get better matches.',
            time: 'Just now',
            isNew: true
        }
    ];

    const isEmpty = recentBriefs.length === 0;

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Manufacture Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review invitations and manage your proposals
                    </p>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Info className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-700">
                            A brand has invited you to review this brief. Take a look to see if it matches your capabilities.
                        </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        Review Brief
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="col-span-3 text-center py-10">Loading stats...</div>
                    ) : (
                        <>
                            <StatCard
                                label="Total Brief"
                                value={isEmpty ? '-' : stats.totalBrief}
                                icon={<FileText />}
                                iconBgColor="bg-gray-50"
                                iconColor="text-gray-600"
                            />
                            <StatCard
                                label="New Brief"
                                value={isEmpty ? '-' : stats.newBrief}
                                icon={<FileText />}
                                iconBgColor="bg-gray-50"
                                iconColor="text-gray-600"
                            />
                            <StatCard
                                label="Active Brief"
                                value={isEmpty ? '-' : stats.activeBrief}
                                icon={<CheckCircle />}
                                iconBgColor="bg-gray-50"
                                iconColor="text-gray-600"
                            />
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Briefs */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Briefs</h2>
                            <Button
                                variant="link"
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => navigate('/manufacturer/marketplace')}
                            >
                                View All
                            </Button>
                        </div>

                        {isEmpty ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invites Yet</h3>
                                <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                                    No briefs have been shared to you yet. When a brand invites you, you'll see their brief here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentBriefs.map((brief) => (
                                    <div
                                        key={brief.id}
                                        className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/manufacturer/briefs/${brief.id}`)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">#{brief.id.substring(0, 8)}</span>
                                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700">
                                                    {brief.status}
                                                </span>
                                            </div>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 h-auto p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/manufacturer/briefs/${brief.id}`);
                                                }}
                                            >
                                                View Details <ArrowRight className="h-3 w-3 ml-1" />
                                            </Button>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{brief.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{brief.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" />
                                                {brief.supplements}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {brief.createdDate}
                                            </span>
                                            <span>{brief.budget}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                            <Button
                                variant="link"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                View All
                            </Button>
                        </div>

                        {isEmpty ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Clock className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">No Notifications Yet</h3>
                                <p className="text-xs text-gray-500">
                                    New updates will appear here when available.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                            {notification.isNew && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                                        <span className="text-xs text-gray-400">{notification.time}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
