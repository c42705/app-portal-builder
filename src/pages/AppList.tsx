
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/layout/AdminLayout';
import AppCard from '@/components/app/AppCard';
import { useAppConfig } from '@/contexts/AppConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

/**
 * AppList component that displays available apps with role-based filtering
 */
const AppList = () => {
  const { apps } = useAppConfig();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // First filter the apps based on user role
  const roleFilteredApps = isAdmin() 
    ? apps 
    : apps.filter(app => app.isActive);
  
  // Then filter apps based on search query
  const filteredApps = roleFilteredApps.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <AdminLayout title="App Portals">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search app portals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          {isAdmin() && (
            <Button onClick={() => navigate('/admin/apps/new')}>
              <Plus size={16} className="mr-2" />
              New App Portal
            </Button>
          )}
        </div>
        
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            {searchQuery ? (
              <>
                <p className="text-gray-500 dark:text-gray-400 mb-2">No app portals found matching "{searchQuery}"</p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400 mb-2">No app portals available</p>
                {isAdmin() && (
                  <Button onClick={() => navigate('/admin/apps/new')}>
                    Create your first app portal
                  </Button>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AppList;
