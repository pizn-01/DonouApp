import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

const TabsContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
}>({
    value: "",
    onValueChange: () => { },
});

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ defaultValue = "", value: controlledValue, onValueChange, children, className }, ref) => {
        const [internalValue, setInternalValue] = React.useState(defaultValue);
        const value = controlledValue !== undefined ? controlledValue : internalValue;

        const handleValueChange = (newValue: string) => {
            if (controlledValue === undefined) {
                setInternalValue(newValue);
            }
            onValueChange?.(newValue);
        };

        return (
            <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
                <div ref={ref} className={cn("", className)}>
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ children, className }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center border-b border-gray-200",
                    className
                )}
            >
                {children}
            </div>
        );
    }
);
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ value, children, className, icon }, ref) => {
        const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
        const isSelected = selectedValue === value;

        return (
            <button
                ref={ref}
                type="button"
                onClick={() => onValueChange(value)}
                className={cn(
                    "inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                    "hover:text-blue-600",
                    isSelected
                        ? "text-blue-600"
                        : "text-gray-500",
                    className
                )}
            >
                {icon && <span className="text-lg">{icon}</span>}
                {children}
                {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
            </button>
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ value, children, className }, ref) => {
        const { value: selectedValue } = React.useContext(TabsContext);

        if (selectedValue !== value) {
            return null;
        }

        return (
            <div ref={ref} className={cn("mt-6", className)}>
                {children}
            </div>
        );
    }
);
TabsContent.displayName = "TabsContent";
