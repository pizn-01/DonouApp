import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming this creates/exists or I use standard textarea
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
// Select imports removed as they are unused

// Placeholder for type until defined in shared types
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
            <div className="max-w-4xl mx-auto space-y-6 py-4">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/briefs")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Brief Manually</h1>
                        <p className="text-muted-foreground">Fill in the details to create a new production brief.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Core Information</CardTitle>
                            <CardDescription>The essential details about your product.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Brief Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Summer 2024 Hoodie Collection"
                                        {...register("title", { required: "Title is required" })}
                                    />
                                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="productType">Product Type</Label>
                                    <Input
                                        id="productType"
                                        placeholder="e.g. Hoodie, T-Shirt"
                                        {...register("productType", { required: "Product Type is required" })}
                                    />
                                    {errors.productType && <span className="text-red-500 text-sm">{errors.productType.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="1000"
                                        {...register("quantity", { required: "Quantity is required", min: 1 })}
                                    />
                                    {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="budget">Target Budget (Per Unit)</Label>
                                    <Input
                                        id="budget"
                                        placeholder="$15.00"
                                        {...register("budget")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deadline">Target Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        {...register("deadline")}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Specifications</CardTitle>
                            <CardDescription>Provide as much detail as possible for manufacturers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="description">Product Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the product in detail..."
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="materials">Materials Preference</Label>
                                    <Input
                                        id="materials"
                                        placeholder="e.g. 100% Organic Cotton, 300gsm"
                                        {...register("materials")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="techSpecs">Technical Support Needed?</Label>
                                    <Input
                                        id="techSpecs"
                                        placeholder="e.g. Pattern making, Grading"
                                        {...register("techSpecs")}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate("/briefs")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                            {isSubmitting ? "Creating..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Brief
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
