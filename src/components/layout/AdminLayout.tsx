
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  AppWindow, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';

/**
 * AdminLayout component that provides the overall structure for admin pages
 * @param {React.ReactNode} children - Content to be rendered within the layout
 * @param {string} title - Title of the current admin page
 */
interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, logout, isAdmin, isDarkTheme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  // Define sidebar items based on user role
  const getSidebarItems = () => {
    // Base items for all users
    const items = [
      { 
        icon: <LayoutDashboard size={20} />, 
        label: 'Dashboard', 
        onClick: () => navigate('/admin'),
        showFor: 'all'
      },
      { 
        icon: <AppWindow size={20} />, 
        label: 'App Portal', 
        onClick: () => navigate('/admin/apps'),
        showFor: 'all'
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
      items.push(
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={cn("min-h-screen flex", isDarkTheme ? "dark bg-gray-900" : "bg-gray-50")}>
      {/* Sidebar - desktop version */}
      <motion.div 
        className={cn(
          "h-screen border-r border-gray-100 shadow-soft flex flex-col z-20",
          isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white",
          sidebarOpen ? "w-64" : "w-20",
          isMobile && !sidebarOpen ? "hidden" : "",
          isMobile && sidebarOpen ? "fixed inset-y-0 left-0 w-64" : ""
        )}
        animate={{ width: sidebarOpen ? (isMobile ? 240 : 240) : (isMobile ? 0 : 80) }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between p-4">
          <div className={cn("flex items-center", !sidebarOpen && "justify-center w-full")}>
            {sidebarOpen && (
              <div className={cn(
                "text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500",
                isDarkTheme ? "from-blue-400 to-indigo-300" : ""
              )}>
                App Portal
              </div>
            )}
            {!sidebarOpen && !isMobile && (
              <div className="h-9 w-9 flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold">
                A
              </div>
            )}
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className={isDarkTheme ? "text-gray-300" : ""}>
              <ChevronRight size={20} />
            </Button>
          )}
        </div>

        <Separator className={isDarkTheme ? "bg-gray-700" : ""} />

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-md transition-all",
                  isDarkTheme 
                    ? "hover:bg-gray-700 focus:ring-gray-600 text-gray-300" 
                    : "hover:bg-gray-100 focus:ring-gray-200 text-gray-500",
                  "focus:outline-none focus:ring-2",
                  !sidebarOpen && "justify-center"
                )}
              >
                <span>{item.icon}</span>
                {sidebarOpen && <span className="ml-3 text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className={cn("p-4 border-t", isDarkTheme ? "border-gray-700" : "border-gray-100")}>
          <div className={cn("flex items-center", !sidebarOpen && "justify-center")}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="ml-3">
                <p className={cn("text-sm font-medium", isDarkTheme ? "text-gray-300" : "text-gray-700")}>{user?.name}</p>
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
      </motion.div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={cn(
          "shadow-sm border-b z-10",
          isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        )}>
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar} 
                  className="mr-2"
                >
                  <Menu size={20} />
                </Button>
              )}
              <h1 className={cn(
                "text-lg font-medium", 
                isDarkTheme ? "text-gray-200" : "text-gray-800"
              )}>
                {title}
              </h1>
            </div>
            <div>
              <Toggle
                pressed={isDarkTheme}
                onPressedChange={toggleTheme}
                aria-label="Toggle dark mode"
              >
                {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
              </Toggle>
            </div>
          </div>
        </header>

        <main className={cn(
          "flex-1 overflow-auto p-4 sm:p-6",
          isDarkTheme ? "bg-gray-900" : "bg-gray-50"
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
