import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload } from "lucide-react";

interface SubmitProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    briefId: string;
}

// No change needed to props
export const SubmitProposalModal = ({ isOpen, onClose, briefId }: SubmitProposalModalProps) => {
    const [formData, setFormData] = useState({
        brandPrice: '',
        timeline: '',
        minimumOrderQuantity: '',
        proposalNotes: ''
    });
    const [files, setFiles] = useState<File[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await import('../../services/proposal.service').then(({ proposalService }) =>
                proposalService.create({
                    brief_id: briefId,
                    price: parseFloat(formData.brandPrice),
                    delivery_timeline: formData.timeline,
                    proposal_details: {
                        notes: formData.proposalNotes,
                        moq: formData.minimumOrderQuantity
                    },
                    attachments: [] // File upload omitted for MVP
                })
            );
            onClose();
            // Ideally trigger refresh in parent
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit proposal');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Submit Your Proposal</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Brand Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brand Price <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            placeholder="€ 0000"
                            value={formData.brandPrice}
                            onChange={(e) => setFormData({ ...formData, brandPrice: e.target.value })}
                            required
                        />
                    </div>

                    {/* Timeline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timeline <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            placeholder="2 weeks"
                            value={formData.timeline}
                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                            required
                        />
                    </div>

                    {/* Minimum Order Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Order Quantity <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            placeholder="00,000 units"
                            value={formData.minimumOrderQuantity}
                            onChange={(e) => setFormData({ ...formData, minimumOrderQuantity: e.target.value })}
                            required
                        />
                    </div>

                    {/* Proposal Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proposal Notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Type here"
                            value={formData.proposalNotes}
                            onChange={(e) => setFormData({ ...formData, proposalNotes: e.target.value })}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attachments
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                            >
                                <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="text-blue-600 font-medium">Browse</span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    or drag your file (PNG, JPG, PDF, DOC)
                                </p>
                            </label>
                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {files.map((file, index) => (
                                        <div key={index} className="text-xs text-gray-600 text-left">
                                            {file.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        {error && <div className="text-red-500 text-sm px-1">{error}</div>}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Proposal'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
