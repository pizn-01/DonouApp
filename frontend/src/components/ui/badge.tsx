import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                // Brief status badges from design
                draft: "bg-gray-100 text-gray-700",
                shared: "bg-primary-100 text-primary-600",
                open: "bg-primary-100 text-primary-600",
                matched: "bg-warning-100 text-warning-600",
                "proposal-received": "bg-purple-100 text-purple-600",
                "in-progress": "bg-primary-100 text-primary-700",
                completed: "bg-success-100 text-success-700",
                archived: "bg-gray-100 text-gray-500",

                // Generic badges
                success: "bg-success-100 text-success-700",
                warning: "bg-warning-100 text-warning-600",
                error: "bg-error-100 text-error-600",
                info: "bg-primary-100 text-primary-700",
                default: "bg-gray-100 text-gray-700",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
