import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Clock, FileText, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/manufacturer/StatCard';

export default function ManufacturerDashboardPage() {
    const navigate = useNavigate();

    // Mock data - in production, fetch from API
    const stats = {
        totalBrief: 3,
        newBrief: 2,
        activeBrief: 3
    };

    const recentBriefs = [
        {
            id: '#WF7234570',
            title: 'Premium Vitamin D3 Supplement',
            status: 'Draft',
            description: 'This brief is being created with AI assistance. The AI will help you fill in the details.',
            supplements: 'Dietary Supplements',
            createdDate: '18/01/2026',
            budget: '€1000 - €250000 USD'
        },
        {
            id: '#WF7234570',
            title: 'Premium Vitamin D3 Supplement',
            status: 'Upload',
            description: 'This brief is being created with AI assistance. The AI will help you fill in the details.',
            supplements: 'Dietary Supplements',
            createdDate: '18/01/2026',
            budget: '€1000 - €250000 USD'
        },
        {
            id: '#WF7234570',
            title: 'Premium Vitamin D3 Supplement',
            status: 'Upload',
            description: 'This brief is being created with AI assistance. The AI will help you fill in the details.',
            supplements: 'Dietary Supplements',
            createdDate: '18/01/2026',
            budget: '€1000 - €250000 USD'
        }
    ];

    const notifications = [
        {
            id: 1,
            title: 'New manufacturer match',
            message: 'A new manufacturer has been matched to your brief',
            time: '2h ago',
            isNew: true
        },
        {
            id: 2,
            title: 'Brief published',
            message: 'Your brief "Premium Vitamin D3 Supplement" has been successfully published',
            time: '5h ago',
            isNew: false
        },
        {
            id: 3,
            title: 'Draft reminder',
            message: 'You have 2 drafts that haven\'t been updated in over a week',
            time: '1d ago',
            isNew: false
        },
        {
            id: 4,
            title: 'Brief published',
            message: 'Your brief "Premium Vitamin D3 Supplement" has been successfully published',
            time: '2d ago',
            isNew: false
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
                                                <span className="text-xs text-gray-500">{brief.id}</span>
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded
                                                    ${brief.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                                                        brief.status === 'Upload' ? 'bg-green-50 text-green-700' :
                                                            'bg-blue-50 text-blue-700'}`}>
                                                    {brief.status}
                                                </span>
                                            </div>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 h-auto p-0"
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
