import { useState } from 'react';
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
    AlertCircle,
    File,
    MessageSquare,
    Building2
} from "lucide-react";

export default function BriefDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [showProposalModal, setShowProposalModal] = useState(false);

    // Mock Data
    const brief = {
        id: "WF7224578",
        title: "Premium Vitamin D3 Supplement",
        companyName: "Evergreensuppl.co",
        status: "new-invitation",
        createdDate: "18/01/2026",
        lastUpdated: "16/01/2026",
        description: `We are looking for a reliable packaging solution for our new vitamin supplement line. The packaging solution to be eco-friendly, aesthetically pleasing and cost-effective. We will help you fill in the details.`,
        requirements: `We are looking for a eco-friendly packaging solution for our new modern skincare. The packaging should be 100% recyclable, aesthetically pleasing, and cost-effective. We aim to launch this product in Q2 2024.`,
        supplements: "Dietary Supplements",
        specs: {
            material: "Recyclable cardboard or biodegradable plastic",
            printing: "Full color CMYK with some finish",
            dimensions: "15cm x 10cm x 5cm",
            moq: "10,000 units minimum"
        },
        details: {
            quantity: "5,000 units",
            timeline: "6-12 weeks",
            budget: "€20,000 - €45,000 USD",
            supplements: "Dietary Supplements"
        },
        attachments: [
            { name: "Specs.pdf", size: "2.4 MB" },
            { name: "Design-mockup.png", size: "780 Document > 4.2 MB" }
        ],
        warnings: [
            {
                type: "timeline",
                message: "The timeline is not specified. Consider asking the brand for clarification before submitting your proposal."
            },
            {
                type: "moq",
                message: "MOQ is not mentioned. Confirming this ensures your proposal matches expectations."
            }
        ]
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <button
                        onClick={() => navigate('/manufacturer/marketplace')}
                        className="hover:text-gray-700"
                    >
                        Product Briefs
                    </button>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900">Premium Vitamin D3 Supplement</span>
                </div>

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-gray-900">{brief.title}</h1>
                            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                {brief.status === 'new-invitation' ? 'New Invitation' : brief.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {brief.companyName}
                            </span>
                            <span>•</span>
                            <span>{brief.supplements}</span>
                            <span>•</span>
                            <span>Created {brief.createdDate}</span>
                            <span>•</span>
                            <span>Last Updated {brief.lastUpdated}</span>
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
                        >
                            Submit Proposal
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
                        {/* Warning Cards */}
                        {brief.warnings.map((warning, index) => (
                            <div
                                key={index}
                                className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">{warning.message}</p>
                                </div>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Chat with Brand
                                </Button>
                            </div>
                        ))}

                        {/* Project Requirements */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Requirements</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {brief.requirements}
                            </p>
                        </div>

                        {/* Technical Specifications */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Material</label>
                                    <p className="text-sm text-gray-900 mt-1">{brief.specs.material}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Dimensions</label>
                                    <p className="text-sm text-gray-900 mt-1">{brief.specs.dimensions}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Printing</label>
                                    <p className="text-sm text-gray-900 mt-1">{brief.specs.printing}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">MOQ</label>
                                    <p className="text-sm text-gray-900 mt-1">{brief.specs.moq}</p>
                                </div>
                            </div>
                        </div>

                        {/* Brief Details */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brief Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500">Quantity</label>
                                        <p className="text-sm text-gray-900">{brief.details.quantity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500">Timeline</label>
                                        <p className="text-sm text-gray-900">{brief.details.timeline}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500">Budget</label>
                                        <p className="text-sm text-gray-900">{brief.details.budget}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-500">Supplements</label>
                                        <p className="text-sm text-gray-900">{brief.details.supplements}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
                            <div className="space-y-3">
                                {brief.attachments.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <File className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                            <p className="text-xs text-gray-500">{file.size}</p>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Download
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Proposal Tab */}
                    <TabsContent value="proposal">
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
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
        </DashboardLayout>
    );
}
