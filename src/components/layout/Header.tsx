
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Moon,
  Search,
  Sun,
  Menu,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [searchVisible, setSearchVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const { toast } = useToast();
  
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Assignment due",
      description: "Your Database Systems project is due in 2 days",
      time: "2 days ago",
      unread: true,
    },
    {
      id: 2,
      title: "Grades published",
      description: "Grades for Advanced Algorithms have been published",
      time: "3 days ago",
      unread: true,
    },
    {
      id: 3,
      title: "New announcement",
      description: "Course AI Ethics has a new announcement",
      time: "1 week ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  
  // Quick function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setChatVisible(!chatVisible);
    // We're simulating the chat opening by showing a toast
    if (!chatVisible) {
      toast({
        title: "Chat Assistant",
        description: "University assistant is ready to help you!",
      });
    }
  };

  // Mark a notification as read
  const markAsRead = (id: number) => {
    // In a real app, this would call an API to mark the notification as read
    toast({
      title: "Notification marked as read",
      description: "This notification has been marked as read",
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    // In a real app, this would call an API to mark all notifications as read
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    });
  };

  return (
    <header className="h-16 border-b bg-background flex items-center px-4 sticky top-0 z-30">
      <div className="flex-1 flex items-center gap-4">
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        
        {searchVisible ? (
          <div className="max-w-md w-full">
            <Input 
              placeholder="Search courses, assignments, etc..." 
              className="w-full"
              autoFocus
              onBlur={() => setSearchVisible(false)}
            />
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchVisible(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleChat}
          title="Chat with university assistant"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" title="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]" 
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead} 
                  className="text-xs h-auto py-1 px-2"
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`flex flex-col items-start p-3 cursor-pointer ${notification.unread ? 'bg-muted/50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/notifications')} className="justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePic} alt={user?.name} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
