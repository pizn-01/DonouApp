import * as React from "react";
import { Building2, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface ProposalCardProps {
    briefId: string;
    briefTitle: string;
    brandName: string;
    onSave?: (data: ProposalData) => void;
    onSubmit?: (data: ProposalData) => void;
    className?: string;
}

interface ProposalData {
    rate: string;
    timeline: string;
    totalUnits: string;
    description: string;
    sendEmail: boolean;
}

export function ProposalCard({
    briefId,
    briefTitle,
    brandName,
    onSave,
    onSubmit,
    className,
}: ProposalCardProps) {
    const [formData, setFormData] = React.useState<ProposalData>({
        rate: "",
        timeline: "",
        totalUnits: "",
        description: "",
        sendEmail: true,
    });

    const totalCost = formData.rate && formData.totalUnits
        ? (parseFloat(formData.rate) * parseFloat(formData.totalUnits)).toFixed(2)
        : "0.00";

    const handleSave = () => {
        onSave?.(formData);
    };

    const handleSubmit = () => {
        onSubmit?.(formData);
    };

    return (
        <Card className={cn("border border-gray-200", className)}>
            <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 text-body-sm text-gray-500 mb-1">
                        <Building2 className="h-4 w-4" />
                        <span>{brandName}</span>
                    </div>
                    <h3 className="text-h4 text-gray-900">{briefTitle}</h3>
                    <p className="text-body-sm text-primary-600 mt-1">Brief #{briefId}</p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-body-sm font-medium text-gray-700">Rate</label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={formData.rate}
                            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                            className="text-center"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-body-sm font-medium text-gray-700">Timeline</label>
                        <Input
                            type="text"
                            placeholder="3 weeks"
                            value={formData.timeline}
                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                            className="text-center"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-body-sm font-medium text-gray-700">Total units</label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={formData.totalUnits}
                            onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                            className="text-center"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-body-sm font-medium text-gray-700">Total</label>
                        <div className="h-10 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-body-md font-medium text-gray-900">
                            ${totalCost}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-body-sm font-medium text-gray-700">Description</label>
                    <Textarea
                        placeholder="Tell us about your requirements and specifications for this project..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="min-h-[100px] resize-none"
                    />
                    <p className="text-body-sm text-gray-500">
                        Provide any additional requirements or questions for the brand
                    </p>
                </div>

                {/* Email Checkbox */}
                <div className="flex items-start gap-3 p-3 bg-primary-50 border border-primary-200 rounded-md">
                    <input
                        type="checkbox"
                        id="sendEmail"
                        checked={formData.sendEmail}
                        onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    />
                    <label htmlFor="sendEmail" className="text-body-sm text-gray-700 cursor-pointer">
                        Send email to brand (if your requirements are compatible with each others, they'll also get notified via email. This increases your visibility score.)
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button variant="secondary" onClick={handleSave}>
                        Save plan
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Empty state component
interface NoProposalsProps {
    className?: string;
}

export function NoProposalsState({ className }: NoProposalsProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-h3 text-gray-900 mb-2">No Proposals Yet</h3>
            <p className="text-body-md text-gray-600 max-w-md mb-6">
                Start browsing open briefs and submit your first proposal. All briefs shown are ready for proposals!
            </p>
            <a href="/manufacturer/briefs" className="text-body-md font-medium text-primary-600 hover:text-primary-700 underline">
                Find Manufacturers
            </a>
        </div>
    );
}
