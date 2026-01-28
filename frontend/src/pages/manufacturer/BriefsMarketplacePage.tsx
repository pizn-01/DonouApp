import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Building2,
    Package,
    Calendar,
    Wallet,
    ChevronDown,
    FileText,
    CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/manufacturer/StatCard';

// Mock Data - Only open briefs visible to manufacturers
const MOCK_OPEN_BRIEFS = [
    {
        id: "RB1234528",
        title: "Premium Vitamin D3 Supplement",
        status: "open",
        description: "Looking for a manufacturer with GMP certification to produce vitamin D3 supplements. Need 1000 units for initial order.",
        category: "Dietary Supplements",
        budget: { min: 1000, max: 100000, currency: "USD" },
        timeline: "2026-04-15",
        companyName: "Evergreensuppl.co"
    },
    {
        id: "RB1234529",
        title: "Organic Cotton T-Shirts",
        status: "open",
        description: "Sustainable fashion brand seeking manufacturer for organic cotton t-shirts. GOTS certification required.",
        category: "Apparel",
        budget: { min: 5000, max: 15000, currency: "USD" },
        timeline: "2026-03-20",
        companyName: "EcoWear Co."
    },
    {
        id: "RB1234530",
        title: "Premium Leather Handbags",
        status: "open",
        description: "Luxury accessories brand looking for high-quality leather handbag manufacturer.",
        category: "Accessories",
        budget: { min: 30000, max: 50000, currency: "USD" },
        timeline: "2026-05-10",
        companyName: "LuxeAccessories"
    }
];

export default function BriefsMarketplacePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredBriefs = MOCK_OPEN_BRIEFS.filter(brief => {
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
                        <h1 className="text-h2 text-gray-900">My Briefs Marketplace</h1>
                        <p className="text-body-md text-gray-500 mt-1">
                            Browse open product briefs from brands and submit proposals.
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        label="Total Brief"
                        value={MOCK_OPEN_BRIEFS.length}
                        icon={<FileText />}
                        iconBgColor="bg-gray-50"
                        iconColor="text-gray-600"
                    />
                    <StatCard
                        label="New Brief"
                        value={2}
                        icon={<FileText />}
                        iconBgColor="bg-gray-50"
                        iconColor="text-gray-600"
                    />
                    <StatCard
                        label="Active Brief"
                        value={3}
                        icon={<CheckCircle />}
                        iconBgColor="bg-gray-50"
                        iconColor="text-gray-600"
                    />
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

                        {/* Status Filter - Always "Open" for manufacturers */}
                        <div className="relative">
                            <select
                                disabled
                                className="h-10 pl-3.5 pr-9 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-700 appearance-none cursor-not-allowed"
                            >
                                <option>Open Briefs</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Brief Cards */}
                <div className="flex flex-col gap-4">
                    {paginatedBriefs.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
                            <div className="w-36 h-36 mx-auto mb-4">
                                <img src="/assets/manufacturer/02_My%20Brief_All%20briefs.png" alt="No Briefs" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-h4 text-gray-900 mb-2">No briefs found</h3>
                            <p className="text-body-md text-gray-500">
                                {searchTerm
                                    ? "Try adjusting your search or filters"
                                    : "No open briefs available at the moment"}
                            </p>
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
                                                    <Badge variant="shared">
                                                        Open
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
                                                        <span>{brief.companyName}</span>
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
                                                <Link to={`/manufacturer/briefs/${brief.id}`}>
                                                    <Button variant="primary" size="md">
                                                        View & Submit Proposal
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
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
