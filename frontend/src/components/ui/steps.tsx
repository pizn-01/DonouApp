import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepsProps {
    steps: {
        id: string;
        title: string;
        description: string;
    }[];
    currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
                {steps.map((step, stepIdx) => (
                    <li key={step.id} className="relative overflow-hidden lg:flex-1">
                        <div
                            className={cn(
                                "border-b border-gray-200 overflow-hidden lg:border-0",
                                stepIdx === 0 ? "border-t-0" : "",
                                stepIdx === steps.length - 1 ? "border-b-0" : ""
                            )}
                        >
                            <div aria-current="step" className="group">
                                <div className="flex items-center px-6 py-5 text-sm font-medium">
                                    <span className="flex-shrink-0">
                                        {stepIdx < currentStep ? (
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary group-hover:bg-primary/90 transition-colors shadow-sm">
                                                <Check className="h-6 w-6 text-white" aria-hidden="true" />
                                            </span>
                                        ) : stepIdx === currentStep ? (
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm ring-4 ring-primary/10">
                                                <span className="text-primary font-bold">0{stepIdx + 1}</span>
                                            </span>
                                        ) : (
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 group-hover:border-gray-300 transition-colors">
                                                <span className="text-gray-500 group-hover:text-gray-900 font-medium">0{stepIdx + 1}</span>
                                            </span>
                                        )}
                                    </span>
                                    <div className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                        <span className={cn(
                                            "text-sm font-bold tracking-tight",
                                            stepIdx <= currentStep ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            {step.title}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground mt-0.5">{step.description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {stepIdx !== steps.length - 1 && (
                            <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                                <svg
                                    className="h-full w-full text-gray-300"
                                    viewBox="0 0 22 80"
                                    fill="none"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M0 -2L20 40L0 82"
                                        vectorEffect="non-scaling-stroke"
                                        stroke="currentcolor"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
