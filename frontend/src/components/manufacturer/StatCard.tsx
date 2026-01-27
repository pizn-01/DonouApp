import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor?: string;
    iconColor?: string;
}

export const StatCard = ({
    label,
    value,
    icon,
    iconBgColor = "bg-blue-50",
    iconColor = "text-blue-600"
}: StatCardProps) => {
    return (
        <div className="flex items-center gap-4 p-6 bg-white rounded-lg border border-gray-200">
            <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg",
                iconBgColor
            )}>
                <div className={cn("text-xl", iconColor)}>
                    {icon}
                </div>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
};
