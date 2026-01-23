import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, MoreVertical, DollarSign, FileText, CheckCircle, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefStatus, type Brief } from "@/features/briefs/types";
// import { cn } from "@/lib/utils"; (Removed unused)

// Mock Data (in a real app, fetch by ID)
const MOCK_BRIEF: Brief = {
    id: "1",
    brandId: "brand-1",
    title: "Premium Cotton T-Shirts Collection",
    description: "Looking for high-quality cotton t-shirt manufacturing with specific GSM requirements for our Summer 2024 line. Need organic certifications. We are aiming for a soft hand-feel and durable stitching for a premium streetwear brand.",
    status: BriefStatus.ACTIVE,
    category: "Apparel",
    requirements: {
        productType: "T-Shirt",
        quantity: 5000,
        specifications: ["100% Organic Cotton", "GSM 180", "Double-needle stitching", "Pre-shrunk fabric"],
        qualityStandards: ["ISO 9001", "GOTS Certified"],
        packagingRequirements: "Individual polybags with biodegradable material",
        additionalNotes: "Must communicate in English. Samples required before bulk production."
    },
    budget: { min: 20000, max: 25000, currency: "USD" },
    timeline: "3 months",
    aiGenerated: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
};

export default function BriefDetailsPage() {
    // const { id } = useParams(); // (Removed unused)
    const navigate = useNavigate();
    // Simulate fetch
    const brief = MOCK_BRIEF;

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/briefs")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">{brief.title}</h1>
                        <p className="text-muted-foreground text-sm">Created on {new Date(brief.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Brief
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

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
                                <CardTitle>Technical Requirements</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Product Type</h4>
                                        <p className="text-muted-foreground">{brief.requirements.productType}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Quantity</h4>
                                        <p className="text-muted-foreground">{brief.requirements.quantity.toLocaleString()} units</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Specifications</h4>
                                    <ul className="list-disc list-inside text-muted-foreground">
                                        {brief.requirements.specifications.map((spec, i) => (
                                            <li key={i}>{spec}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Quality Standards</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {brief.requirements.qualityStandards?.map((std, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                                                {std}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="text-sm">Status</span>
                                    </div>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                        {brief.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">Category</span>
                                    </div>
                                    <span className="font-medium text-sm">{brief.category}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-sm">Budget</span>
                                    </div>
                                    <span className="font-medium text-sm">
                                        ${brief.budget.min.toLocaleString()} - ${brief.budget.max.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">Timeline</span>
                                    </div>
                                    <span className="font-medium text-sm">{brief.timeline}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-4">
                            <h4 className="font-semibold text-indigo-900 mb-1">AI Insights</h4>
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                This brief has a high match potential. We recommend adding more details about packaging to attract top-tier suppliers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
