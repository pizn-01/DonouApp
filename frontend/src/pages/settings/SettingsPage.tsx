import { useState } from "react";
import { User, Building, Lock, Bell, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const TABS = [
    { id: "account", label: "Account", icon: User },
    { id: "organization", label: "Organization", icon: Building },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("account");

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
                        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0 p-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-primary text-primary-foreground shadow-md translate-x-1"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground hover:pl-5"
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <div className="flex-1 space-y-6 w-full">
                        {activeTab === "account" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Card className="border-muted hover:shadow-sm transition-all">
                                    <CardHeader>
                                        <CardTitle>Profile Information</CardTitle>
                                        <CardDescription>Update your photo and personal details.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative group cursor-pointer">
                                                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground border-4 border-background shadow-lg overflow-hidden">
                                                    {/* Placeholder for avatar image */}
                                                    <span className="group-hover:hidden">{user.firstName[0]}{user.lastName[0]}</span>
                                                    <Camera className="hidden group-hover:block h-8 w-8 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-lg">Profile Photo</h3>
                                                <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                                                <Button variant="outline" size="sm" className="mt-2">Upload New Photo</Button>
                                            </div>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="text-base">First Name</Label>
                                                <Input id="firstName" defaultValue={user.firstName} className="h-11" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="text-base">Last Name</Label>
                                                <Input id="lastName" defaultValue={user.lastName} className="h-11" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-base">Email</Label>
                                                <Input id="email" defaultValue={user.email} disabled className="h-11 bg-muted/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-base">Phone Number</Label>
                                                <Input id="phone" placeholder="+1 (555) 000-0000" className="h-11" />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t">
                                            <Button size="lg">Save Changes</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === "organization" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Card className="border-muted hover:shadow-sm transition-all">
                                    <CardHeader>
                                        <CardTitle>Organization Details</CardTitle>
                                        <CardDescription>Manage your company information.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-base">Company Name</Label>
                                                <Input defaultValue="Acme Fashion Inc." className="h-11" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-base">Website</Label>
                                                <Input placeholder="https://example.com" className="h-11" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-base">Description</Label>
                                                <textarea className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y" placeholder="Tell us about your brand..." />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4 border-t">
                                            <Button size="lg">Update Organization</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Card className="border-muted hover:shadow-sm transition-all">
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>Change your password to keep your account secure.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-base">Current Password</Label>
                                            <Input type="password" className="h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-base">New Password</Label>
                                            <Input type="password" className="h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-base">Confirm New Password</Label>
                                            <Input type="password" className="h-11" />
                                        </div>
                                        <div className="flex justify-end pt-4 border-t mt-4">
                                            <Button size="lg">Update Password</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Card className="border-muted hover:shadow-sm transition-all">
                                    <CardHeader>
                                        <CardTitle>Email Notifications</CardTitle>
                                        <CardDescription>Choose what updates you want to receive.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {["New proposals received", "Brief status updates", "Marketing emails", "Security alerts"].map((item) => (
                                            <div key={item} className="flex items-center justify-between space-x-2 border p-6 rounded-lg bg-muted/20">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base font-semibold">{item}</Label>
                                                    <p className="text-sm text-muted-foreground">Receive updates about {item.toLowerCase()}.</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer" defaultChecked />
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-end mt-4 gap-4 pt-4 border-t">
                                            <Button variant="ghost" size="lg">Reset to Defaults</Button>
                                            <Button size="lg">Save Preferences</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
