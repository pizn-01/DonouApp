import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "./types";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export function RegisterForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema) as any,
        defaultValues: {
            email: "",
            password: "",
            role: "BRAND",
            companyName: "",
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
            setError(err.response?.data?.error?.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            disabled={isLoading}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            disabled={isLoading}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>I am a:</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="BRAND"
                                    disabled={isLoading}
                                    {...register("role")}
                                    className="h-4 w-4"
                                />
                                <span>Brand</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="MANUFACTURER"
                                    disabled={isLoading}
                                    {...register("role")}
                                    className="h-4 w-4"
                                />
                                <span>Manufacturer</span>
                            </label>
                        </div>
                    </div>

                    {selectedRole === "BRAND" && (
                        <div className="grid gap-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                disabled={isLoading}
                                {...register("companyName")}
                            />
                            {errors.companyName && (
                                <p className="text-sm text-red-500">{errors.companyName.message}</p>
                            )}
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </div>
            </form>
        </div>
    );
}
