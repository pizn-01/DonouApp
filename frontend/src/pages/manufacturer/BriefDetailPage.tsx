import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SubmitProposalModal } from "@/components/manufacturer/SubmitProposalModal";
import {
    ChevronRight,
    FileText,
    Clock,
    DollarSign,
    Package,
    File,
    MessageSquare,
    Building2
} from "lucide-react";

export default function BriefDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [showProposalModal, setShowProposalModal] = useState(false);

    const [brief, setBrief] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [myProposal, setMyProposal] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Parallel fetch: Brief Details + My Proposals (to check status)
                const [briefRes, proposalsRes] = await Promise.allSettled([
                    import('../../services/brief.service').then(({ briefService }) => briefService.getById(id)),
                    import('../../services/proposal.service').then(({ proposalService }) => proposalService.getMyProposals())
                ]);

                // Handle Brief
                if (briefRes.status === 'fulfilled') {
                    setBrief(briefRes.value);
                } else {
                    throw new Error('Failed to load brief');
                }

                // Handle Proposal Status
                if (proposalsRes.status === 'fulfilled') {
                    const found = proposalsRes.value.find((p: any) => p.brief_id === id);
                    setMyProposal(found || null);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="p-6 text-center">Loading brief details...</div>;
    if (error || !brief) return <div className="p-6 text-center text-red-500">{error || 'Brief not found'}</div>;

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <button
                        onClick={() => navigate('/manufacturer/marketplace')}
                        className="hover:text-gray-700"
                    >
                        My Briefs Marketplace
                    </button>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900">{brief.title || 'Brief Detail'}</span>
                </div>

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12">
                                <img src="/assets/manufacturer/03_Brief%20Detail_Overview.png" alt="Brief" className="w-full h-full object-contain" />
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-900">{brief.title}</h1>
                            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                {brief.status === 'new-invitation' ? 'New Invitation' : brief.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {brief.brand_profiles?.company_name || 'Brand'}
                            </span>
                            <span>•</span>
                            <span>{new Date(brief.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/manufacturer/messages')}
                        >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setShowProposalModal(true)}
                            disabled={!!myProposal}
                        >
                            {myProposal ? 'Proposal Sent' : 'Submit Proposal'}
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="overview">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="proposal">
                            Proposal
                        </TabsTrigger>
                        <TabsTrigger value="chat">
                            Chat
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">

                        {/* Project Requirements */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {brief.description}
                            </p>
                        </div>

                        {/* Technical Specifications */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {brief.requirements?.specifications?.map((spec: string, index: number) => (
                                    <li key={index}>{spec}</li>
                                )) || <li>No specific specifications listed</li>}
                            </ul>
                        </div>

                        {/* Brief Details */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brief Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500">Quantity</label>
                                        <p className="text-sm text-gray-900">{brief.requirements?.quantity?.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500">Timeline</label>
                                        <p className="text-sm text-gray-900">{brief.timeline}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500">Budget</label>
                                        <p className="text-sm text-gray-900">{brief.currency} {brief.budget_range_min?.toLocaleString()} - {brief.budget_range_max?.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500">Product Type</label>
                                        <p className="text-sm text-gray-900">{brief.requirements?.productType}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
                            <div className="space-y-3">
                                {brief.attachments?.map((fileUrl: string, index: number) => {
                                    const fileName = fileUrl.split('/').pop() || 'File';
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                            onClick={() => window.open(fileUrl, '_blank')}
                                        >
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <File className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                Download
                                            </Button>
                                        </div>
                                    );
                                })}
                                {(!brief.attachments || brief.attachments.length === 0) && (
                                    <p className="text-sm text-gray-500">No attachments</p>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Proposal Tab */}
                    <TabsContent value="proposal">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            {myProposal ? (
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-green-100 rounded-full">
                                            <FileText className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="tex-lg font-semibold text-gray-900">Proposal Submitted</h3>
                                            <p className="text-sm text-gray-500">Submitted on {new Date(myProposal.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <Badge className="ml-auto capitalize">{myProposal.status.replace('_', ' ')}</Badge>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <p><strong>Price:</strong> {myProposal.currency} {myProposal.price}</p>
                                        <p><strong>Timeline:</strong> {myProposal.delivery_timeline}</p>
                                        <p><strong>Notes:</strong> {myProposal.proposal_details?.notes}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Proposals Submitted Yet</h3>
                                    <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                                        You haven't submitted a proposal yet. Sending a proposal helps the brand evaluate your capabilities.
                                    </p>
                                    <Button onClick={() => setShowProposalModal(true)}>
                                        Submit Proposal
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Chat Tab */}
                    <TabsContent value="chat">
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
                            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                                Start a conversation with the brand to discuss project details.
                            </p>
                            <Button>
                                Send Message
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Proposal Modal */}
                <SubmitProposalModal
                    isOpen={showProposalModal}
                    onClose={() => setShowProposalModal(false)}
                    briefId={id || ''}
                />
            </div>
        </DashboardLayout >
    );
}
