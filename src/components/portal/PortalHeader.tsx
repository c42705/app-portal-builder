
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppConfig } from '@/contexts/AppConfigContext';

/**
 * Header component for the portal page
 * Shows the app logo, title and sign out button
 */
interface PortalHeaderProps {
  app: AppConfig;
  onLogout: () => void;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({ app, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src={app.logoUrl} 
            alt={app.title} 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <h1 className="text-lg font-medium">{app.title}</h1>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLogout}
        >
          <LogOut size={16} className="mr-2" />
          Sign out
        </Button>
      </div>
    </header>
  );
};

export default PortalHeader;
