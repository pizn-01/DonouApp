import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                // Primary button - Blue-600 from design
                primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",

                // Secondary button - White with border
                secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100",

                // Destructive
                destructive: "bg-error-600 text-white hover:bg-error-700 active:bg-error-800",

                // Outline
                outline: "border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700",

                // Ghost
                ghost: "hover:bg-gray-100 text-gray-700",

                // Link
                link: "text-primary-600 underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-5 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    leadingIcon?: React.ReactNode
    trailingIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, leadingIcon, trailingIcon, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {leadingIcon && <span className="w-4 h-4">{leadingIcon}</span>}
                {children}
                {trailingIcon && <span className="w-4 h-4">{trailingIcon}</span>}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
