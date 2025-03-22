
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
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  const sidebarItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard', 
      onClick: () => navigate('/admin') 
    },
    { 
      icon: <AppWindow size={20} />, 
      label: 'App Portal', 
      onClick: () => navigate('/admin/apps') 
    },
    { 
      icon: <Users size={20} />, 
      label: 'Users', 
      onClick: () => navigate('/admin/users') 
    },
    { 
      icon: <Settings size={20} />, 
      label: 'Settings', 
      onClick: () => navigate('/admin/settings') 
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - desktop version */}
      <motion.div 
        className={cn("h-screen bg-white border-r border-gray-100 shadow-soft flex flex-col z-20",
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
              <div className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
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
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronRight size={20} />
            </Button>
          )}
        </div>

        <Separator />

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-md transition-all",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200",
                  !sidebarOpen && "justify-center"
                )}
              >
                <span className="text-gray-500">{item.icon}</span>
                {sidebarOpen && <span className="ml-3 text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className={cn("flex items-center", !sidebarOpen && "justify-center")}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs text-gray-500"
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
        <header className="bg-white shadow-sm border-b border-gray-100 z-10">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                  <Menu size={20} />
                </Button>
              )}
              <h1 className="text-lg font-medium text-gray-800">{title}</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
