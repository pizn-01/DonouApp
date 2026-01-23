import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, onChange, ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    className="peer h-4 w-4 opacity-0 absolute cursor-pointer z-10"
                    ref={ref}
                    onChange={(e) => {
                        onChange?.(e);
                        onCheckedChange?.(e.target.checked);
                    }}
                    {...props}
                />
                <div className={cn(
                    "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex items-center justify-center transition-colors pointer-events-none",
                    "peer-checked:bg-primary peer-checked:text-primary-foreground border-muted-foreground/30",
                    className
                )}>
                    <Check className="h-3 w-3 hidden peer-checked:block text-white" strokeWidth={3} />
                </div>
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
