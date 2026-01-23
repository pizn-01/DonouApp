import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, Building2, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { registerSchema, type RegisterInput } from "./types";
import { cn } from "@/lib/utils";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export function RegisterForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema) as any,
        defaultValues: {
            role: "BRAND",
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        setError("");

        try {
            await axios.post(`${API_URL}/auth/register`, data);
            navigate("/auth/login");
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-5">

                    {/* Role Selection */}
                    <div className="grid gap-2">
                        <Label className="text-base">I am a</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={cn(
                                    "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50",
                                    selectedRole === "BRAND" ? "border-primary bg-primary/5" : "border-muted"
                                )}
                                onClick={() => setValue("role", "BRAND")}
                            >
                                <Building2 className={cn("h-8 w-8", selectedRole === "BRAND" ? "text-primary" : "text-muted-foreground")} />
                                <div className="text-center">
                                    <div className="font-semibold">Brand</div>
                                    <div className="text-[10px] text-muted-foreground">Looking for manufacturers</div>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50",
                                    selectedRole === "MANUFACTURER" ? "border-primary bg-primary/5" : "border-muted"
                                )}
                                onClick={() => setValue("role", "MANUFACTURER")}
                            >
                                <Factory className={cn("h-8 w-8", selectedRole === "MANUFACTURER" ? "text-primary" : "text-muted-foreground")} />
                                <div className="text-center">
                                    <div className="font-semibold">Manufacturer</div>
                                    <div className="text-[10px] text-muted-foreground">Looking for clients</div>
                                </div>
                            </div>
                        </div>
                        {/* Hidden input to register role with hook form properly if needed, but we used setValue above. 
                             To ensure validation works if we didn't set default, we could register a hidden input. 
                             Since we have default, it's fine. */}
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="Enter First Name" {...register("firstName")} disabled={isLoading} className="bg-muted/5" />
                            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Enter Last Name" {...register("lastName")} disabled={isLoading} className="bg-muted/5" />
                            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    {/* Organization Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="companyName">Organization Name</Label>
                        <Input id="companyName" placeholder="Enter Organization Name" {...register("companyName")} disabled={isLoading} className="bg-muted/5" />
                        {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input id="email" type="email" placeholder="Enter Email" {...register("email")} disabled={isLoading} className="bg-muted/5" />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                {...register("password")}
                                disabled={isLoading}
                                className="bg-muted/5 pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter Password"
                                {...register("confirmPassword")}
                                disabled={isLoading}
                                className="bg-muted/5 pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="terms"
                            onCheckedChange={(checked) => setValue("terms", checked === true)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms"
                                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                            >
                                By creating an account, you agree to our <Link to="#" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link to="#" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                            </label>
                            {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <Button className="h-11 text-base w-full mt-2" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>

                    <div className="text-center mt-4">
                        <span className="text-sm text-muted-foreground">Already have an account? </span>
                        <Link to="/auth/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
