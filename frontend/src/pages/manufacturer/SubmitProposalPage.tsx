import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChevronLeft, Upload, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock Alert component if missing
const AlertMock = ({ children, className, variant = "default" }: any) => (
    <div className={`p-4 rounded-lg border ${variant === "destructive" ? "bg-red-50 border-red-200 text-red-800" : "bg-blue-50 border-blue-200 text-blue-800"} ${className}`}>
        {children}
    </div>
);
const AlertTitleMock = ({ children }: any) => <h5 className="font-medium mb-1">{children}</h5>;
const AlertDescriptionMock = ({ children }: any) => <div className="text-sm">{children}</div>;

export default function SubmitProposalPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate('/manufacturer/dashboard'); // Redirect to dashboard after success
        }, 1500);
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 max-w-3xl space-y-8">
                <Button variant="ghost" className="pl-0 gap-2" onClick={() => navigate(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                    Back to Brief
                </Button>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Submit Proposal</h1>
                    <p className="text-muted-foreground mt-1">
                        Create a comprehensive proposal for Brief #{id}. Brands appreciate detailed breakdowns.
                    </p>
                </div>

                <AlertMock className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertTitleMock>Pro Tip</AlertTitleMock>
                    <AlertDescriptionMock>
                        Mentioning your relevant certifications (e.g. GOTS) increases your chance of winning by 40%.
                    </AlertDescriptionMock>
                </AlertMock>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Proposal Details</CardTitle>
                            <CardDescription>Outline your approach, pricing, and timeline.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="coverLetter">
                                    Cover Letter
                                </label>
                                <Textarea
                                    id="coverLetter"
                                    placeholder="Introduce your factory, relevant experience, and why you are the best fit for this project..."
                                    className="min-h-[200px]"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Focus on similar past projects and your unique capabilities.</p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="price">
                                        Total Estimated Cost ($)
                                    </label>
                                    <Input id="price" type="number" placeholder="20000" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="timeline">
                                        Estimated Timeline (Days)
                                    </label>
                                    <Input id="timeline" type="number" placeholder="45" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Attachments</label>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm font-medium">Click to upload files</p>
                                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-3 border-t bg-muted/20 p-6">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Proposal"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </DashboardLayout>
    );
}
