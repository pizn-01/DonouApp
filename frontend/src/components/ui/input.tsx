import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    helperText?: string
    error?: boolean
    errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, helperText, error, errorMessage, ...props }, ref) => {
        const inputId = React.useId()
        const hasError = error || !!errorMessage

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-gray-900",
                        "placeholder:text-gray-500",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        hasError
                            ? "border-error-600 focus-visible:ring-error-600"
                            : "border-gray-200 focus-visible:ring-primary-600",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {helperText && !hasError && (
                    <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
                )}
                {errorMessage && (
                    <p className="mt-1.5 text-xs text-error-600">{errorMessage}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
