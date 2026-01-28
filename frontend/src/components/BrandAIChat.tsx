import * as React from "react";
import { Sparkles, Send, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface BrandAIChatProps {
    className?: string;
}

export function BrandAIChat({ className }: BrandAIChatProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [inputValue, setInputValue] = React.useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm here to help! Let me assist you with that.",
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
            >
                <Sparkles className="h-6 w-6" />
            </button>
        );
    }

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 w-80 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-h4 text-gray-900">Donau AI Assistant</h3>
                        <p className="text-body-sm text-gray-500">Ask us anything about your brief.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="h-16 w-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                            <Sparkles className="h-8 w-8 text-primary-600" />
                        </div>
                        <h4 className="text-h4 text-gray-900 mb-2">Welcome to Donau AI!</h4>
                        <p className="text-body-md text-gray-600 mb-6">
                            I can help you polish your product brief, suggest vetted manufacturers, or track your pending proposals
                        </p>
                        <div className="flex flex-col gap-2 w-full">
                            <Button variant="secondary" size="sm" className="w-full">
                                Draft a Proposal
                            </Button>
                            <Button variant="secondary" size="sm" className="w-full">
                                Find Manufacturers
                            </Button>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-3",
                                message.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            {message.role === "assistant" && (
                                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "rounded-lg px-4 py-2.5 max-w-[80%]",
                                    message.role === "user"
                                        ? "bg-primary-600 text-white"
                                        : "bg-gray-100 text-gray-900"
                                )}
                            >
                                <p className="text-body-md">{message.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                    <button className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100">
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Type your response..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="w-full h-10 pl-3.5 pr-3 py-2.5 rounded-md border border-gray-200 text-body-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="h-10 w-10 flex items-center justify-center bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
