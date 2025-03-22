
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, UserPlus } from 'lucide-react';
import { AddUserForm } from './AddUserForm';

/**
 * Admin-only settings tab for platform management
 */
const AdminSettingsTab = () => {
  const [showAddUserForm, setShowAddUserForm] = React.useState(false);
  
  return (
    <div className="space-y-6">
      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Add and manage users of the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddUserForm ? (
            <AddUserForm onCancel={() => setShowAddUserForm(false)} />
          ) : (
            <Button onClick={() => setShowAddUserForm(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure global platform settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Default App Settings</h3>
            <div className="grid gap-2">
              <Label htmlFor="defaultLogo">Default App Logo URL</Label>
              <Input 
                id="defaultLogo" 
                defaultValue="/placeholder.svg"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Email Configuration</h3>
            <div className="grid gap-2">
              <Label htmlFor="emailSender">Email Sender Address</Label>
              <Input 
                id="emailSender" 
                defaultValue="noreply@appportal.example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emailTemplate">Welcome Email Template</Label>
              <Input 
                id="emailTemplate"
                defaultValue="Welcome to App Portal! Your temporary password is: {{password}}"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button>Save System Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsTab;
