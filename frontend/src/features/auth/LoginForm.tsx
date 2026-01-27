import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginInput } from "./types";
import axios from "axios";

// Helper for API base - should go in lib/api.ts later
const API_URL = "http://localhost:3000/api";

export function LoginForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_URL}/auth/login`, data);

            // Store token
            localStorage.setItem("token", response.data.data.accessToken);
            localStorage.setItem("user", JSON.stringify(response.data.data.user));

            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-base">Email</Label>
                        <Input
                            id="email"
                            placeholder="Enter Email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="h-11 bg-muted/5"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                autoComplete="current-password"
                                disabled={isLoading}
                                className="h-11 bg-muted/5 pr-10"
                                {...register("password")}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                            >
                                Remember Me
                            </label>
                        </div>
                        <Link
                            to="/auth/forgot-password"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                        >
                            Forgot Password
                        </Link>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <Button className="h-11 text-base w-full mt-2" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>

                    <div className="text-center mt-4">
                        <span className="text-sm text-muted-foreground">Don't have an account? </span>
                        <Link to="/auth/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
