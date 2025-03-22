
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserSettingsTab from '@/components/settings/UserSettingsTab';
import AdminSettingsTab from '@/components/settings/AdminSettingsTab';

/**
 * Settings page with appropriate tabs based on user role
 */
const Settings = () => {
  const { isAdmin } = useAuth();
  
  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account Settings</TabsTrigger>
            {isAdmin() && <TabsTrigger value="admin">Admin Settings</TabsTrigger>}
          </TabsList>
          <TabsContent value="account" className="space-y-6">
            <UserSettingsTab />
          </TabsContent>
          {isAdmin() && (
            <TabsContent value="admin" className="space-y-6">
              <AdminSettingsTab />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
