import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Building2,
    Package,
    Calendar,
    Wallet,
    MessageSquare,
    Sparkles,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BriefStatus, type Brief } from "@/features/briefs/types";
import { cn } from "@/lib/utils";

const MOCK_BRIEFS: Brief[] = [
    {
        id: "RB1234528",
        title: "Premium Vitamin D3 Supplement",
        status: BriefStatus.DRAFT,
        description: "This brief is being created with AI assistance. The AI will help you fill in the details.",
        category: "Dietary Supplements",
        budget: { min: 1000, max: 100000, currency: "USD" },
        timeline: "2026-04-15",
        aiGenerated: false,
        createdAt: "2025-01-26T10:00:00Z",
        updatedAt: "2025-01-26T10:00:00Z",
        brandId: "1",
        companyName: "Evergreensuppl.co",
        requirements: {
            productType: "Supplements",
            quantity: 1000,
            specifications: ["Vitamin D3", "Capsules"],
            qualityStandards: ["GMP Certified"],
        }
    },
    {
        id: "RB1234529",
        title: "Premium Vitamin D3 Supplement",
        status: BriefStatus.ACTIVE,
        description: "This brief is being created with AI assistance. The AI will help you fill in the details.",
        category: "Dietary Supplements",
        budget: { min: 1000, max: 100000, currency: "USD" },
        timeline: "2026-04-15",
        aiGenerated: false,
        createdAt: "2025-01-26T10:00:00Z",
        updatedAt: "2025-01-26T10:00:00Z",
        brandId: "1",
        companyName: "Evergreensuppl.co",
        requirements: {
            productType: "Supplements",
            quantity: 1000,
            specifications: [],
        }
    },
    {
        id: "RB1234530",
        title: "Premium Vitamin D3 Supplement",
        status: "matched" as BriefStatus,
        description: "This brief is being created with AI assistance. The AI will help you fill in the details.",
        category: "Dietary Supplements",
        budget: { min: 1000, max: 100000, currency: "USD" },
        timeline: "2026-04-15",
        aiGenerated: false,
        createdAt: "2025-01-26T10:00:00Z",
        updatedAt: "2025-01-26T10:00:00Z",
        brandId: "1",
        companyName: "Evergreensuppl.co",
        requirements: {
            productType: "Supplements",
            quantity: 1000,
            specifications: [],
        }
    },
    {
        id: "RB1234531",
        title: "Premium Vitamin D3 Supplement",
        status: "proposal-received" as BriefStatus,
        description: "The brand has chosen another manufacturer for this brief. You can still view the proposal for reference or continue submitting proposals to other briefs.",
        category: "Dietary Supplements",
        budget: { min: 1000, max: 100000, currency: "USD" },
        timeline: "2026-04-15",
        aiGenerated: false,
        createdAt: "2025-01-26T10:00:00Z",
        updatedAt: "2025-01-26T10:00:00Z",
        brandId: "1",
        companyName: "Evergreensuppl.co",
        requirements: {
            productType: "Supplements",
            quantity: 1000,
            specifications: [],
        }
    }
];

const getStatusBadgeVariant = (status: BriefStatus): "draft" | "shared" | "matched" | "proposal-received" | "default" => {
    const statusMap: Record<string, "draft" | "shared" | "matched" | "proposal-received" | "default"> = {
        [BriefStatus.DRAFT]: "draft",
        [BriefStatus.ACTIVE]: "shared",
        "matched": "matched",
        "proposal-received": "proposal-received",
        [BriefStatus.IN_PROGRESS]: "shared",
        [BriefStatus.COMPLETED]: "matched",
    };
    return statusMap[status] || "default";
};

const formatStatus = (status: BriefStatus): string => {
    const statusNames: Record<string, string> = {
        [BriefStatus.DRAFT]: "Draft",
        [BriefStatus.ACTIVE]: "Shared",
        "matched": "Matched",
        "proposal-received": "Proposal Received",
        [BriefStatus.IN_PROGRESS]: "Shared",
        [BriefStatus.COMPLETED]: "Matched",
    };
    return statusNames[status] || status;
};

export default function BriefsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const itemsPerPage = 5;

    const filteredBriefs = MOCK_BRIEFS.filter(brief => {
        // Search filtering
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            if (
                !brief.title.toLowerCase().includes(term) &&
                !brief.description.toLowerCase().includes(term) &&
                !brief.category.toLowerCase().includes(term)
            ) {
                return false;
            }
        }

        // Category filtering
        if (categoryFilter !== "all" && brief.category !== categoryFilter) {
            return false;
        }

        // Status filtering
        if (statusFilter !== "all" && brief.status !== statusFilter) {
            return false;
        }

        return true;
    });

    const totalPages = Math.ceil(filteredBriefs.length / itemsPerPage);
    const paginatedBriefs = filteredBriefs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-h2 text-gray-900">My Briefs</h1>
                        <p className="text-body-md text-gray-500 mt-1">
                            Manage your manufacturing projects
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/briefs/create-ai">
                            <Button variant="secondary" leadingIcon={<Sparkles className="text-primary-600" />}>
                                Spark with AI
                            </Button>
                        </Link>
                        <Link to="/briefs/create">
                            <Button variant="primary" leadingIcon={<Plus />}>
                                New Brief
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex gap-3 flex-wrap">
                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="h-10 pl-3.5 pr-9 rounded-md border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-600"
                            >
                                <option value="all">Select Category</option>
                                <option value="Dietary Supplements">Dietary Supplements</option>
                                <option value="Apparel">Apparel</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Page Filter - placeholder for now */}
                        <div className="relative">
                            <select className="h-10 pl-3.5 pr-9 rounded-md border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-600">
                                <option>Select Page</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 pl-3.5 pr-9 rounded-md border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-600"
                            >
                                <option value="all">Select Status</option>
                                <option value={BriefStatus.DRAFT}>Draft</option>
                                <option value={BriefStatus.ACTIVE}>Shared</option>
                                <option value="matched">Matched</option>
                                <option value="proposal-received">Proposal Received</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Brief Cards */}
                <div className="flex flex-col gap-4">
                    {paginatedBriefs.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-h4 text-gray-900 mb-2">No briefs found</h3>
                            <p className="text-body-md text-gray-500 mb-6">
                                {searchTerm
                                    ? "Try adjusting your search or filters"
                                    : "Create your first brief to get started"}
                            </p>
                            {!searchTerm && (
                                <Link to="/briefs/create">
                                    <Button variant="primary">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create First Brief
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        paginatedBriefs.map((brief) => (
                            <Card key={brief.id} className="border border-gray-200 hover:border-primary-200 hover:shadow-md transition-all">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-2 flex-1">
                                                {/* Brief ID and Title */}
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className="text-body-sm text-primary-600 font-medium">
                                                        #{brief.id}
                                                    </span>
                                                    <h3 className="text-h4 text-gray-900">
                                                        {brief.title}
                                                    </h3>
                                                    <Badge variant={getStatusBadgeVariant(brief.status)}>
                                                        {formatStatus(brief.status)}
                                                    </Badge>
                                                </div>

                                                {/* Description */}
                                                <p className="text-body-md text-gray-600 line-clamp-2">
                                                    {brief.description}
                                                </p>

                                                {/* Metadata */}
                                                <div className="flex items-center gap-6 text-body-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4" />
                                                        <span>{brief.companyName || "Company"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4" />
                                                        <span>{brief.category}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{brief.timeline}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Wallet className="h-4 w-4" />
                                                        <span>
                                                            {brief.budget.currency} {brief.budget.min.toLocaleString()} - {brief.budget.max.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 ml-4">
                                                <Button variant="secondary" size="md">
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    Chat
                                                </Button>
                                                <Link to={`/briefs/${brief.id}`}>
                                                    <Button variant="primary" size="md">
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Info Banner (conditionally shown) */}
                                        {brief.status === "matched" && (
                                            <div className="flex items-start gap-3 p-3 bg-primary-50 border border-primary-200 rounded-md">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center mt-0.5">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-body-sm text-gray-700">
                                                        The brand has chosen another manufacturer for this brief. You can still view the proposal for reference or continue submitting proposals to other briefs.
                                                    </p>
                                                    <button className="text-body-sm font-medium text-primary-600 hover:text-primary-700 mt-1">
                                                        Archive Proposal
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {filteredBriefs.length > itemsPerPage && (
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-body-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBriefs.length)} of {filteredBriefs.length} results
                        </p>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
