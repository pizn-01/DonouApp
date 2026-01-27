import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, FileText, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChatDialog } from "@/components/messaging/ChatDialog";

export default function BriefDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [brief, setBrief] = useState<any>(null);
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [briefRes, proposalsRes] = await Promise.allSettled([
                    import('../../services/brief.service').then(({ briefService }) => briefService.getById(id)),
                    import('../../services/proposal.service').then(({ proposalService }) => proposalService.getForBrief(id))
                ]);

                if (briefRes.status === 'fulfilled') {
                    setBrief(briefRes.value);
                } else {
                    throw new Error('Failed to load brief');
                }

                if (proposalsRes.status === 'fulfilled') {
                    setProposals(proposalsRes.value);
                }
            } catch (err: any) {
                console.error(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleProposalAction = async (proposalId: string, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            const { proposalService } = await import('../../services/proposal.service');
            await proposalService.updateStatus(proposalId, status);

            alert(status === 'ACCEPTED' ? "Proposal Accepted" : "Proposal Rejected");

            // Refresh data
            const [briefRes, proposalsRes] = await Promise.all([
                import('../../services/brief.service').then(({ briefService }) => briefService.getById(id!)),
                import('../../services/proposal.service').then(({ proposalService }) => proposalService.getForBrief(id!))
            ]);
            setBrief(briefRes);
            setProposals(proposalsRes);

        } catch (err: any) {
            alert("Error: " + (err.message || "Failed to update proposal status"));
        }
    };

    if (loading) return <DashboardLayout><div className="p-10 text-center">Loading brief...</div></DashboardLayout>;
    if (!brief) return <DashboardLayout><div className="p-10 text-center text-red-500">Brief not found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/brand/dashboard")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold tracking-tight">{brief.title}</h1>
                            <Badge variant={brief.status === 'matched' ? 'matched' : 'open'}>
                                {brief.status.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">Created on {new Date(brief.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="proposals">
                            Proposals
                            {proposals.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                    {proposals.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="leading-relaxed text-muted-foreground">
                                            {brief.description}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Project Requirements</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-sm mb-2">Product Type</h4>
                                                <p className="text-muted-foreground">{brief.requirements?.productType}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm mb-2">Quantity</h4>
                                                <p className="text-muted-foreground">{brief.requirements?.quantity?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm mb-2">Specifications</h4>
                                            <ul className="list-disc list-inside text-muted-foreground">
                                                {brief.requirements?.specifications?.map((spec: string, i: number) => (
                                                    <li key={i}>{spec}</li>
                                                )) || <li>No specifications listed</li>}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-sm">Timeline</span>
                                            </div>
                                            <span className="font-medium text-sm">{brief.timeline}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <DollarSign className="h-4 w-4" />
                                                <span className="text-sm">Budget</span>
                                            </div>
                                            <span className="font-medium text-sm">
                                                {brief.currency} {brief.budget_range_min?.toLocaleString()} - {brief.budget_range_max?.toLocaleString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="proposals">
                        <div className="space-y-6">
                            {proposals.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900">No proposals yet</h3>
                                    <p className="text-muted-foreground">Wait for manufacturers to submit their proposals.</p>
                                </div>
                            ) : (
                                proposals.map((proposal) => (
                                    <Card key={proposal.id} className="overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                                        {proposal.manufacturer?.company_name || 'Manufacturer'}
                                                        {proposal.manufacturer?.verification_status === 'verified' && (
                                                            <CheckCircle className="h-4 w-4 text-blue-500" />
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">Submitted {new Date(proposal.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <Badge variant={
                                                    proposal.status === 'ACCEPTED' ? 'success' :
                                                        proposal.status === 'REJECTED' ? 'error' :
                                                            'info'
                                                }>
                                                    {proposal.status}
                                                </Badge>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-6 mb-6 bg-slate-50 p-4 rounded-lg">
                                                <div>
                                                    <span className="text-sm text-muted-foreground block mb-1">Proposed Price</span>
                                                    <span className="font-semibold text-lg">{proposal.currency} {proposal.price?.toLocaleString()}</span>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-muted-foreground block mb-1">Timeline</span>
                                                    <span className="font-medium">{proposal.delivery_timeline}</span>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-muted-foreground block mb-1">MOQ</span>
                                                    <span className="font-medium">{proposal.proposal_details?.moq || 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="font-semibold text-sm mb-2">Proposal Notes</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {proposal.proposal_details?.notes}
                                                </p>
                                            </div>

                                            {proposal.status === 'SUBMITTED' && (
                                                <div className="flex gap-3 justify-end pt-4 border-t">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedProposal(proposal);
                                                            setChatOpen(true);
                                                        }}
                                                        className="mr-auto"
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Chat
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleProposalAction(proposal.id, 'REJECTED')}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleProposalAction(proposal.id, 'ACCEPTED')}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Accept Proposal
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            {selectedProposal && brief && (
                <ChatDialog
                    open={chatOpen}
                    onOpenChange={setChatOpen}
                    briefId={brief.id}
                    brandId={brief.brand_id}
                    manufacturerId={selectedProposal.manufacturer_id}
                    title={selectedProposal.manufacturer?.company_name || 'Chat'}
                />
            )}
        </DashboardLayout>
    );
}
