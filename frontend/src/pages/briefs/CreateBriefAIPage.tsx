import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Steps } from "@/components/ui/steps";
import { type GenerateBriefInput } from "@/features/briefs/types";
import { useNavigate } from "react-router-dom";

const STEPS = [
    { id: 'basics', title: 'Product Basics', description: 'What are you making?' },
    { id: 'details', title: 'Details & Target', description: 'Who is it for?' },
    { id: 'generate', title: 'AI Generation', description: 'Review & Edit' },
];

export default function CreateBriefAIPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<GenerateBriefInput>({
        defaultValues: {
            productType: "",
            quantity: 1000,
            targetMarket: "",
            budgetRange: "",
            timeline: "",
            additionalDetails: ""
        }
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const onSubmit = async (_data: GenerateBriefInput) => {
        setIsGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            navigate("/briefs");
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-10 py-4">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-2">
                        <Sparkles className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Create with AI</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Draft a comprehensive manufacturing brief in minutes with our advanced AI assistant.
                    </p>
                </div>

                <Steps steps={STEPS} currentStep={currentStep} />

                <Card className="min-h-[450px] shadow-lg border-muted/60 relative overflow-hidden">
                    {/* Decorative gradient blob */}
                    <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                    <CardContent className="p-8 md:p-12 relative z-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                            <div className="flex-1">
                                {currentStep === 0 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
                                        <div className="grid gap-3">
                                            <Label htmlFor="productType" className="text-xl font-semibold">What type of product do you want to manufacture?</Label>
                                            <Input
                                                id="productType"
                                                placeholder="e.g., Organic Cotton Hoodie, Stainless Steel Water Bottle"
                                                className="h-14 text-lg px-4 shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20"
                                                {...register("productType", { required: true })}
                                            />
                                            {errors.productType && <span className="text-red-500 text-sm font-medium">Product type is required</span>}
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="quantity" className="text-xl font-semibold">Estimated Quantity</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                className="h-14 text-lg px-4 shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20"
                                                {...register("quantity", { valueAsNumber: true })}
                                            />
                                            <p className="text-sm text-muted-foreground">Approximate units for the first run.</p>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
                                        <div className="grid gap-3">
                                            <Label htmlFor="targetMarket" className="text-xl font-semibold">Who is your target market?</Label>
                                            <Input
                                                id="targetMarket"
                                                placeholder="e.g., Gen Z, Luxury Shoppers, Outdoor Enthusiasts"
                                                className="h-14 text-lg px-4 shadow-sm border-muted-foreground/20"
                                                {...register("targetMarket")}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="grid gap-3">
                                                <Label htmlFor="budgetRange" className="text-base font-semibold">Budget Range</Label>
                                                <Input id="budgetRange" className="h-12" placeholder="$5,000 - $10,000" {...register("budgetRange")} />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="timeline" className="text-base font-semibold">Timeline</Label>
                                                <Input id="timeline" className="h-12" placeholder="3 months" {...register("timeline")} />
                                            </div>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="additionalDetails" className="text-base font-semibold">Additional Details</Label>
                                            <Input id="additionalDetails" className="h-12" placeholder="Specific materials, colors, or certifications needed..." {...register("additionalDetails")} />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="flex flex-col items-center justify-center py-10 space-y-8 text-center animate-in fade-in zoom-in duration-500">
                                        <div className="h-24 w-24 bg-gradient-to-br from-indigo-50 to-white rounded-full flex items-center justify-center shadow-inner border border-indigo-50">
                                            <Sparkles className="h-12 w-12 text-indigo-600 animate-pulse" />
                                        </div>
                                        <div className="space-y-3 max-w-lg">
                                            <h3 className="text-2xl font-bold tracking-tight">Ready to Generate Magic</h3>
                                            <p className="text-lg text-muted-foreground">
                                                Our AI will analyze your inputs and generate a detailed technical brief including specifications, quality standards, and estimated costs.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-12 pt-8 border-t">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={currentStep === 0 || isGenerating}
                                    className="text-base"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>

                                {currentStep < 2 ? (
                                    <Button type="button" onClick={nextStep} size="lg" className="min-w-[140px] text-base">
                                        Next Step
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={isGenerating} size="lg" className="bg-indigo-600 hover:bg-indigo-700 min-w-[200px] text-base relative overflow-hidden transition-all hover:scale-105 active:scale-95">
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                Generate Brief
                                                <Sparkles className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
