import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Globe, MapPin, List, Award, Hash, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthLayout } from "@/components/layout/AuthLayout";
import type { User } from "@/features/auth/types";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

// Brand Schema
const brandSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    industry: z.string().min(2, "Industry is required"),
    description: z.string().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Manufacturer Schema
const manufacturerSchema = z.object({
    businessName: z.string().min(2, "Business name is required"),
    location: z.string().min(2, "Location is required"),
    productionCapacity: z.string().optional(),
    minimumOrderQuantity: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1, "Must be at least 1")).optional().or(z.literal("")),
    capabilities: z.string().optional(), // Comma separated
    certifications: z.string().optional(), // Comma separated
});

export default function OnboardingPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Initialize forms
    const brandForm = useForm({
        resolver: zodResolver(brandSchema),
    });

    const manufacturerForm = useForm({
        resolver: zodResolver(manufacturerSchema),
    });

    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            const parsedUser = JSON.parse(userJson);
            setUser(parsedUser);

            // Pre-fill some data if available
            if (parsedUser.role === "BRAND") {
                // brandForm.setValue("companyName", parsedUser.companyName || ""); // If available
            } else {
                // manufacturerForm.setValue("businessName", parsedUser.companyName || ""); 
            }
        }
    }, []);

    interface BrandFormData {
        companyName: string;
        industry: string;
        description?: string;
        website?: string;
    }

    interface ManufacturerFormData {
        businessName: string;
        location: string;
        productionCapacity?: string;
        minimumOrderQuantity?: number | string;
        capabilities?: string;
        certifications?: string;
    }

    const onBrandSubmit = async (data: BrandFormData) => {
        setIsLoading(true);
        setError("");
        try {
            await axios.put(`${API_URL}/auth/profile`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            handleSuccess();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save profile.";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError((err as any)?.response?.data?.error?.message || errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onManufacturerSubmit = async (data: ManufacturerFormData) => {
        setIsLoading(true);
        setError("");
        try {
            // Transform comma separated strings to arrays and handle numeric fields
            const payload = {
                ...data,
                minimumOrderQuantity: data.minimumOrderQuantity === "" ? undefined : Number(data.minimumOrderQuantity),
                capabilities: data.capabilities ? data.capabilities.split(',').map((s: string) => s.trim()) : [],
                certifications: data.certifications ? data.certifications.split(',').map((s: string) => s.trim()) : [],
            };

            await axios.put(`${API_URL}/auth/profile`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            handleSuccess();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save profile.";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError((err as any)?.response?.data?.error?.message || errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        // Update local user
        if (user) {
            const updatedUser = { ...user, onboardingCompleted: true };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            navigate("/dashboard");
        }
    };

    if (!user) return null; // Or loader

    return (
        <AuthLayout
            title="Complete Your Profile"
            subtitle={`Tell us more about your ${user.role === 'BRAND' ? 'brand' : 'manufacturing business'}`}
        >
            <div className="grid gap-6">
                {user.role === "BRAND" ? (
                    <form onSubmit={brandForm.handleSubmit(onBrandSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" {...brandForm.register("companyName")} />
                                {brandForm.formState.errors.companyName && <p className="text-sm text-red-500">{brandForm.formState.errors.companyName.message?.toString()}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input id="industry" placeholder="e.g. Apparel, Electronics" {...brandForm.register("industry")} />
                                {brandForm.formState.errors.industry && <p className="text-sm text-red-500">{brandForm.formState.errors.industry.message?.toString()}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="website" className="pl-9" placeholder="https://" {...brandForm.register("website")} />
                                </div>
                                {brandForm.formState.errors.website && <p className="text-sm text-red-500">{brandForm.formState.errors.website.message?.toString()}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Tell us about your brand..." {...brandForm.register("description")} />
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <Button className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Profile
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={manufacturerForm.handleSubmit(onManufacturerSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input id="businessName" {...manufacturerForm.register("businessName")} />
                                {manufacturerForm.formState.errors.businessName && <p className="text-sm text-red-500">{manufacturerForm.formState.errors.businessName.message?.toString()}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="location" className="pl-9" placeholder="City, Country" {...manufacturerForm.register("location")} />
                                </div>
                                {manufacturerForm.formState.errors.location && <p className="text-sm text-red-500">{manufacturerForm.formState.errors.location.message?.toString()}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="productionCapacity">Capacity (Monthly)</Label>
                                    <div className="relative">
                                        <Box className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="productionCapacity" className="pl-9" placeholder="e.g. 5000 units" {...manufacturerForm.register("productionCapacity")} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="minimumOrderQuantity">MOQ</Label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="minimumOrderQuantity" type="number" className="pl-9" placeholder="e.g. 100" {...manufacturerForm.register("minimumOrderQuantity")} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="capabilities">Capabilities (Comma separated)</Label>
                                <div className="relative">
                                    <List className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="capabilities" className="pl-9" placeholder="e.g. Cut & Sew, Embroidery, Dyeing" {...manufacturerForm.register("capabilities")} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="certifications">Certifications (Comma separated)</Label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="certifications" className="pl-9" placeholder="e.g. ISO 9001, GOTS" {...manufacturerForm.register("certifications")} />
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <Button className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Profile
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
}
