
import React, { useState } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { PasswordResetForm } from './PasswordResetForm';

/**
 * User settings tab for personal account preferences
 */
const UserSettingsTab = () => {
  const { user, updateUserProfile, isDarkTheme, toggleTheme } = useAuth();
  const [profileData, setProfileData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  /**
   * Handles changes to form fields
   * @param e Change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Saves updated profile information
   */
  const handleSaveProfile = async () => {
    if (await updateUserProfile(profileData)) {
      setIsEditingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account details and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block mt-1">
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>

          {isEditingProfile ? (
            <div className="space-y-4 mt-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={handleChange}
                  disabled // Email cannot be changed in this demo
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input 
                  id="avatar" 
                  name="avatar" 
                  value={profileData.avatar || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => setIsEditingProfile(true)}
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password and account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showPasswordReset ? (
            <PasswordResetForm onCancel={() => setShowPasswordReset(false)} />
          ) : (
            <Button variant="outline" onClick={() => setShowPasswordReset(true)}>
              Change Password
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your experience with app settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-gray-500">Switch between light and dark themes</p>
            </div>
            <Switch 
              checked={isDarkTheme} 
              onCheckedChange={toggleTheme} 
              aria-label="Toggle dark mode"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive email updates about account activity</p>
            </div>
            <Switch defaultChecked aria-label="Toggle email notifications" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettingsTab;
