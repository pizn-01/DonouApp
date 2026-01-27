import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Info, FileUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
interface CreateBriefInput {
    title: string;
    productType: string;
    quantity: number;
    budget: string;
    deadline: string;
    description: string;
    materials: string;
    techSpecs: string;
}

export default function CreateBriefPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<CreateBriefInput>();

    const onSubmit = async (_data: CreateBriefInput) => {
        setIsSubmitting(true);
        console.log("Submitting:", _data);
        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate("/briefs");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="flex items-center gap-3 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/briefs")} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Production Brief</h1>
                        <p className="text-muted-foreground mt-1">Define your requirements to get accurate proposals from top-tier manufacturers.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area NOT in a single Card, but sections */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} id="brief-form" className="space-y-8">

                            {/* Section 1: Essentials */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">1</div>
                                    <h2 className="text-xl font-semibold">Core Essentials</h2>
                                </div>

                                <Card className="border shadow-sm">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-base font-medium">Project Title <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="title"
                                                    placeholder="e.g. Summer 2025 Organic Cotton Hoodie Collection"
                                                    className="h-12 text-lg"
                                                    {...register("title", { required: "Title is required" })}
                                                />
                                                {errors.title ? (
                                                    <span className="text-red-500 text-sm">{errors.title.message}</span>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Give your project a descriptive name.</p>
                                                )}
                                            </div>

                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="productType">Product Category <span className="text-red-500">*</span></Label>
                                                    <Input
                                                        id="productType"
                                                        placeholder="e.g. Hoodie, Denim, Activewear"
                                                        {...register("productType", { required: "Category is required" })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="quantity">Quantity (Units) <span className="text-red-500">*</span></Label>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        placeholder="e.g. 500"
                                                        {...register("quantity", { required: "Quantity is required", min: 1 })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 2: Details */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">2</div>
                                    <h2 className="text-xl font-semibold">Specifications & Materials</h2>
                                </div>

                                <Card className="border shadow-sm">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-base font-medium">Detailed Description <span className="text-red-500">*</span></Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe the fit, construction, design details, and any special requirements..."
                                                className="min-h-[150px] resize-y"
                                                {...register("description", { required: "Description is required" })}
                                            />
                                            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="materials">Material Preferences</Label>
                                                <Input
                                                    id="materials"
                                                    placeholder="e.g. 100% French Terry Cotton, 400gsm"
                                                    {...register("materials")}
                                                />
                                                <p className="text-xs text-muted-foreground">Be as specific as possible about fabric weight and composition.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="techSpecs">Technical Files</Label>
                                                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                                                    <FileUp className="h-6 w-6 text-muted-foreground mb-2" />
                                                    <span className="text-sm font-medium text-muted-foreground">Drop tech packs here</span>
                                                    <span className="text-xs text-muted-foreground/70">(PDF, JPG, AI supported)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Section 3: Budget & Timeline */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">3</div>
                                    <h2 className="text-xl font-semibold">Targets</h2>
                                </div>

                                <Card className="border shadow-sm">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="budget">Target Budget (Per Unit)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                    <Input
                                                        id="budget"
                                                        placeholder="15.00"
                                                        className="pl-7"
                                                        {...register("budget")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="deadline">Target Delivery Date</Label>
                                                <Input
                                                    id="deadline"
                                                    type="date"
                                                    {...register("deadline")}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                        </form>
                    </div>

                    {/* Right Rail: Guidance & Actions */}
                    <div className="space-y-6">
                        {/* Sticky Action Card */}
                        <div className="sticky top-6 space-y-6">
                            <Card className="bg-slate-50 border-indigo-100 shadow-sm overflow-hidden">
                                <div className="bg-indigo-600 p-4 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="h-4 w-4" />
                                        <h3 className="font-semibold">Pro Tip</h3>
                                    </div>
                                    <p className="text-indigo-100 text-sm">Detailed briefs get 3x more accurate quotes.</p>
                                </div>
                                <CardContent className="p-5 space-y-4">
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <div className="flex items-start gap-2">
                                            <Info className="h-4 w-4 text-indigo-500 mt-0.5" />
                                            <span>Include referencing images or tech packs if available.</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Info className="h-4 w-4 text-indigo-500 mt-0.5" />
                                            <span>Be clear about your MOQ (Minimum Order Quantity).</span>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-200 w-full my-4" />
                                    <div className="pt-2">
                                        <Button
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={isSubmitting}
                                            className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {isSubmitting ? "Creating Brief..." : "Publish Brief"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full mt-2"
                                            onClick={() => navigate("/briefs")}
                                        >
                                            Save as Draft
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Need Help?</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">Not sure about technical details? Our AI can help you draft a professional brief.</p>
                                    <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => navigate("/briefs/create-ai")}>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Use AI Assistant
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
