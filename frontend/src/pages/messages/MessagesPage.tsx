import { useState } from "react";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Check, CheckCheck } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data
const CONVERSATIONS = [
    {
        id: "1",
        name: "EcoTextiles Ltd.",
        avatar: "ET",
        lastMessage: "The fabric samples have been shipped.",
        time: "10:30 AM",
        unread: 2,
        online: true,
    },
    {
        id: "2",
        name: "Global Stitching",
        avatar: "GS",
        lastMessage: "Can we reschedule the meeting?",
        time: "Yesterday",
        unread: 0,
        online: false,
    },
    {
        id: "3",
        name: "PackRight Solutions",
        avatar: "PR",
        lastMessage: "Quote updated for the new quantity.",
        time: "Jan 20",
        unread: 0,
        online: true,
    },
];

const MESSAGES = [
    {
        id: "1",
        senderId: "1",
        text: "Hi there! Just wanted to update you on the cotton sourcing.",
        time: "10:00 AM",
        isMe: false,
    },
    {
        id: "2",
        senderId: "me",
        text: "Great, thanks! Is it still on track for next week?",
        time: "10:05 AM",
        isMe: true,
        status: "read",
    },
    {
        id: "3",
        senderId: "1",
        text: "Yes, absolutely. The fabric samples have been shipped this morning.",
        time: "10:30 AM",
        isMe: false,
    },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState(CONVERSATIONS[0]);
    const [messages, setMessages] = useState(MESSAGES);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now().toString(),
            senderId: "me",
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            status: "sent"
        };

        setMessages([...messages, msg]);
        setNewMessage("");
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-background shadow-sm">
                {/* Sidebar List */}
                <aside className="w-80 border-r flex flex-col bg-muted/10">
                    <div className="p-4 border-b space-y-4">
                        <h1 className="text-xl font-bold tracking-tight">Messages</h1>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                className="pl-9 bg-background"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {CONVERSATIONS.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                                    selectedChat.id === chat.id ? "bg-muted" : ""
                                )}
                            >
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                                        {chat.avatar}
                                    </div>
                                    {chat.online && (
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold truncate">{chat.name}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                                    </div>
                                    <p className={cn(
                                        "text-sm truncate",
                                        chat.unread > 0 ? "font-bold text-foreground" : "text-muted-foreground"
                                    )}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                {chat.unread > 0 && (
                                    <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                                        {chat.unread}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Chat Area */}
                <main className="flex-1 flex flex-col min-w-0 bg-background">
                    {/* Header */}
                    <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                                {selectedChat.avatar}
                            </div>
                            <div>
                                <h2 className="font-semibold">{selectedChat.name}</h2>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </header>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-max max-w-[70%] flex-col gap-1 rounded-2xl px-4 py-2 text-sm shadow-sm",
                                    msg.isMe
                                        ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-white border rounded-bl-none"
                                )}
                            >
                                <p>{msg.text}</p>
                                <div className={cn(
                                    "text-[10px] self-end flex items-center gap-1",
                                    msg.isMe ? "text-primary-foreground/80" : "text-muted-foreground"
                                )}>
                                    {msg.time}
                                    {msg.isMe && (
                                        msg.status === "read" ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-background border-t">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" className="shrink-0" disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
