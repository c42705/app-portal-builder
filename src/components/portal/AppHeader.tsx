
import React from 'react';
import { AppConfig } from '@/contexts/AppConfigContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface AppHeaderProps {
  app: AppConfig;
}

const AppHeader: React.FC<AppHeaderProps> = ({ app }) => {
  const { user } = useAuth();
  
  // Find user's permission in this app
  const userInApp = app.users.find(u => u.email === user?.email);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="portal-gradient text-white rounded-2xl p-5 shadow-md mb-6 overflow-hidden"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-full p-2">
            <ImageWithFallback
              src={app.logoUrl}
              fallbackSrc="/placeholder.svg"
              alt={app.title}
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>
          
          <div>
            <h1 className="text-xl font-semibold">Welcome {user?.name.split(' ')[0]},</h1>
            <p className="text-white/90 text-sm">
              We're here to help. Please let us know what you need.
            </p>
          </div>
        </div>
        
        <div className="flex space-x-5">
          <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[4.5rem]">
            <div className="text-xl font-semibold">12</div>
            <div className="text-xs text-white/90">Problems</div>
          </div>
          
          <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[4.5rem]">
            <div className="text-xl font-semibold">14</div>
            <div className="text-xs text-white/90">Changes</div>
          </div>
          
          <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[4.5rem]">
            <div className="text-xl font-semibold">17</div>
            <div className="text-xs text-white/90">Requests</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppHeader;
