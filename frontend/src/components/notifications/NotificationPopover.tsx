import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import type { Notification } from "@/services/notification.service";
import { notificationService } from "@/services/notification.service";
import { useNavigate } from "react-router-dom";

export function NotificationPopover() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            if (Array.isArray(data)) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_read).length);
            } else {
                console.warn('[NotificationPopover] Received invalid data format:', data);
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await notificationService.markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead();
        fetchNotifications();
    };

    const handleNotificationClick = async (n: Notification) => {
        if (!n.is_read) {
            await notificationService.markAsRead(n.id);
            fetchNotifications();
        }
        setOpen(false);
        // Navigate based on type/data
        if (n.type === 'PROPOSAL_RECEIVED' && n.data?.briefId) {
            navigate(`/briefs/${n.data.briefId}`);
        } else if ((n.type === 'PROPOSAL_ACCEPTED' || n.type === 'PROPOSAL_REJECTED') && n.data?.briefId) {
            navigate(`/manufacturer/briefs/${n.data.briefId}`);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 rounded-full transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto px-2 py-1"
                            onClick={handleMarkAllRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${!n.is_read ? 'bg-muted/20' : ''}`}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="space-y-1">
                                            <p className={`text-sm ${!n.is_read ? 'font-medium' : ''}`}>{n.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {new Date(n.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!n.is_read && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary"
                                                onClick={(e) => handleMarkAsRead(n.id, e)}
                                                title="Mark as read"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
