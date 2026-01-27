import { useState } from "react";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Check, CheckCheck } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

interface Message {
    id: string;
    senderId: string;
    text: string;
    time: string;
    isMe: boolean;
    status?: string;
}

// Mock Data
const CONVERSATIONS: Conversation[] = [
    {
        id: "1",
        name: "Portugal Textile S.A.",
        avatar: "PT",
        lastMessage: "The samples will be shipped tomorrow via DHL.",
        time: "10:30 AM",
        unread: 1,
        online: true,
    },
    {
        id: "2",
        name: "EcoFabrics Ltd",
        avatar: "EF",
        lastMessage: "Could you clarify the GSM requirement for the organic cotton?",
        time: "Yesterday",
        unread: 0,
        online: false,
    },
    {
        id: "3",
        name: "Vietnam Garment Co.",
        avatar: "VG",
        lastMessage: "Proposal sent! Let us know what you think.",
        time: "Yesterday",
        unread: 0,
        online: false,
    },
];

const MESSAGES: Message[] = [
    {
        id: "1",
        senderId: "them",
        text: "Hello! We reviewed your brief for the Summer Collection.",
        time: "10:00 AM",
        isMe: false,
    },
    {
        id: "2",
        senderId: "me",
        text: "Great! Do you have experience with recycled polyester?",
        time: "10:05 AM",
        isMe: true,
        status: "read",
    },
    {
        id: "3",
        senderId: "them",
        text: "Yes, we specialize in sustainable synthetic blends. We can send swatches.",
        time: "10:15 AM",
        isMe: false,
    },
    {
        id: "4",
        senderId: "them",
        text: "The samples will be shipped tomorrow via DHL.",
        time: "10:30 AM",
        isMe: false,
    },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
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
                        {CONVERSATIONS.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <p className="text-sm">No messages yet.</p>
                            </div>
                        ) : (
                            CONVERSATIONS.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                                        selectedChat?.id === chat.id ? "bg-muted" : ""
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
                            ))
                        )}
                    </div>
                </aside>

                {/* Chat Area */}
                {/* Chat Area */}
                <main className="flex-1 flex flex-col min-w-0 bg-background">
                    {!selectedChat ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <div className="p-4 rounded-full bg-muted/20 mb-4">
                                <Send className="h-8 w-8 opacity-50" />
                            </div>
                            <h3 className="font-medium text-lg">Your Messages</h3>
                            <p className="text-sm max-w-xs text-center mt-2">
                                Select a conversation to start chatting with manufacturers or brands.
                            </p>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </main>
            </div>
        </DashboardLayout>
    );
}
