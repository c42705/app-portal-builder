
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import CollapsibleSidebar from './CollapsibleSidebar';

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
  const { isDarkTheme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={cn("min-h-screen flex", isDarkTheme ? "dark bg-gray-900" : "bg-gray-50")}>
      {/* Sidebar component */}
      {(!isMobile || sidebarOpen) && (
        <CollapsibleSidebar 
          isDarkTheme={isDarkTheme} 
          onMenuItemClick={() => isMobile && setSidebarOpen(false)}
        />
      )}

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
