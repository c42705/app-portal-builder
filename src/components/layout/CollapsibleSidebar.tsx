
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutDashboard, AppWindow, Users, Settings, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/contexts/NotificationContext';

/**
 * CollapsibleSidebar component that provides navigation with collapse/expand functionality
 * @param {boolean} isDarkTheme - Current theme mode
 * @param {Function} onMenuItemClick - Callback for menu item clicks
 */
interface CollapsibleSidebarProps {
  isDarkTheme: boolean;
  onMenuItemClick?: () => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ isDarkTheme, onMenuItemClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  
  // Load collapsed state from localStorage or default to false (expanded)
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Define sidebar items based on user role
  const getSidebarItems = () => {
    // Base items for all users
    const items = [
      { 
        icon: <AppWindow size={20} />, 
        label: 'App Portal', 
        onClick: () => navigate('/admin/apps'),
        showFor: 'all'
      },
      {
        icon: <Bell size={20} />,
        label: 'Notifications',
        onClick: () => navigate('/admin/notifications'),
        showFor: 'all',
        badge: unreadCount > 0 ? unreadCount : undefined
      },
      { 
        icon: <Settings size={20} />, 
        label: 'Settings', 
        onClick: () => navigate('/admin/settings'),
        showFor: 'all'
      },
    ];
    
    // Admin-only items
    if (isAdmin()) {
      items.unshift(
        { 
          icon: <LayoutDashboard size={20} />, 
          label: 'Dashboard', 
          onClick: () => navigate('/admin'),
          showFor: 'admin'
        }
      );
      
      items.splice(3, 0, 
        { 
          icon: <Users size={20} />, 
          label: 'Users', 
          onClick: () => navigate('/admin/users'),
          showFor: 'admin'
        }
      );
    }
    
    return items;
  };

  const sidebarItems = getSidebarItems();

  return (
    <motion.div 
      className={cn(
        "h-screen border-r flex flex-col z-20 relative",
        isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100",
        collapsed ? "w-20" : "w-64"
      )}
      animate={{ width: collapsed ? 80 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center p-4">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed ? (
            <div className={cn(
              "text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r portal-gradient-text",
              isDarkTheme ? "from-blue-400 to-indigo-300" : ""
            )}>
              App Portal
            </div>
          ) : (
            <div className="h-9 w-9 flex items-center justify-center rounded-md portal-gradient text-white font-bold">
              A
            </div>
          )}
        </div>
      </div>

      <Separator className={isDarkTheme ? "bg-gray-700" : ""} />

      <div className="flex-1 overflow-y-auto py-4 px-2">
        <nav className="space-y-1">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => {
                item.onClick();
                if (onMenuItemClick) onMenuItemClick();
              }}
              className={cn(
                "w-full justify-start transition-all",
                isDarkTheme 
                  ? "hover:bg-gray-700 focus:ring-gray-600 text-gray-300" 
                  : "hover:bg-gray-100 focus:ring-gray-200 text-gray-500",
                collapsed ? "px-3" : "px-3"
              )}
            >
              <span className="relative">
                {item.icon}
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 px-1 min-w-[18px] h-[18px] text-[10px] flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </span>
              {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      <div className={cn("p-4 border-t", isDarkTheme ? "border-gray-700" : "border-gray-100")}>
        <div className={cn("flex items-center", collapsed && "justify-center")}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3">
              <p className={cn("text-sm font-medium truncate max-w-[120px]", isDarkTheme ? "text-gray-300" : "text-gray-700")}>{user?.name}</p>
              <Button 
                variant="link" 
                size="sm" 
                className={cn("p-0 h-auto text-xs", isDarkTheme ? "text-gray-400" : "text-gray-500")}
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut size={12} className="mr-1" /> Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Collapse/Expand button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-3 top-20 h-6 w-6 rounded-full border shadow-sm",
          isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
        )}
      >
        {collapsed ? (
          <ChevronRight size={14} className={isDarkTheme ? "text-gray-400" : ""} />
        ) : (
          <ChevronLeft size={14} className={isDarkTheme ? "text-gray-400" : ""} />
        )}
      </Button>
    </motion.div>
  );
};

export default CollapsibleSidebar;
