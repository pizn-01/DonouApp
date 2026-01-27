import { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { messagingService } from "@/services/messaging.service";
import type { Message } from "@/services/messaging.service";
import { useAuth } from "@/hooks/useAuth";

interface ChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    briefId: string;
    brandId: string;
    manufacturerId: string;
    title: string;
}

export function ChatDialog({ open, onOpenChange, briefId, brandId, manufacturerId, title }: ChatDialogProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            initChat();
        }
    }, [open, briefId]);

    const initChat = async () => {
        setLoading(true);
        try {
            const conversation = await messagingService.initConversation(briefId, manufacturerId, brandId);
            setConversationId(conversation.id);
            const msgs = await messagingService.getMessages(conversation.id);
            setMessages(msgs);
        } catch (error) {
            console.error("Failed to load chat", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !conversationId) return;

        const tempMsg: Message = {
            id: 'temp-' + Date.now(),
            conversation_id: conversationId,
            sender_id: user?.id || '',
            content: newMessage,
            is_ai_generated: false,
            is_read: false,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMsg]);
        setNewMessage("");

        try {
            const sentMsg = await messagingService.sendMessage(conversationId, tempMsg.content);
            // Verify if AI Mock replied (by polling or response) - For MVP response is just the sent msg
            // But if we want AI reply to show up, we might need to re-fetch or wait.
            // Our backend mock AI replies after 1s.
            // Let's refetch updates after 2s.
            setMessages(prev => prev.map(m => m.id === tempMsg.id ? sentMsg : m));

            if (sentMsg.content.includes('@AI')) {
                setTimeout(async () => {
                    const updatedMsgs = await messagingService.getMessages(conversationId);
                    setMessages(updatedMsgs);
                }, 1500);
            }

        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <span>Chat: {title}</span>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 p-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {messages.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-8">
                                    No messages yet. Start the conversation!
                                </p>
                            )}
                            {messages.map((msg) => {
                                const isMe = msg.sender_id === user?.id;
                                const isAi = msg.is_ai_generated; // or msg.content starts with [AI]

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${isMe
                                                ? 'bg-primary text-primary-foreground'
                                                : isAi
                                                    ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                                    : 'bg-muted'
                                                }`}
                                        >
                                            {isAi && <div className="flex items-center gap-1 font-semibold text-xs mb-1"><Bot className="h-3 w-3" /> AI Assistant</div>}
                                            <p>{msg.content}</p>
                                            <span className="text-[10px] opacity-70 block text-right mt-1">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </ScrollArea>

                <div className="p-4 border-t bg-background">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="Type a message... (Use @AI for assistance)"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim() || loading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
