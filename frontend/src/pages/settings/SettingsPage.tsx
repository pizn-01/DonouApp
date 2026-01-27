import { useState } from "react";
import { User, Building, Lock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

// Import new tab components
import { AccountTab } from "@/components/settings/AccountTab";
import { ManufacturerInfoTab } from "@/components/settings/ManufacturerInfoTab";
import { SecurityTab } from "@/components/settings/SecurityTab";

const TABS = [
    { id: "account", label: "Account", icon: User },
    { id: "manufacturer-info", label: "Manufacturer Info", icon: Building },
    { id: "security", label: "Security", icon: Lock }
];

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("account");

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 max-w-6xl mx-auto p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
                        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <tab.icon className={cn(
                                        "h-4 w-4",
                                        activeTab === tab.id ? "text-blue-600" : "text-gray-400"
                                    )} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6 w-full">
                        {activeTab === "account" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <AccountTab />
                            </div>
                        )}

                        {activeTab === "manufacturer-info" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <ManufacturerInfoTab />
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <SecurityTab />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
