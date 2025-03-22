
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAppConfig, AppConfig } from '@/contexts/AppConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { toast } from 'sonner';

interface AppFormProps {
  existingApp?: AppConfig;
}

const AppForm: React.FC<AppFormProps> = ({ existingApp }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addApp, updateApp } = useAppConfig();
  
  const [title, setTitle] = useState(existingApp?.title || '');
  const [description, setDescription] = useState(existingApp?.description || '');
  const [url, setUrl] = useState(existingApp?.url || '');
  const [logoUrl, setLogoUrl] = useState(existingApp?.logoUrl || '/placeholder.svg');
  const [isActive, setIsActive] = useState(existingApp?.isActive ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!existingApp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !url) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditMode && existingApp) {
        updateApp(existingApp.id, {
          title,
          description,
          url,
          logoUrl,
          isActive
        });
      } else {
        if (!user) {
          toast.error('You must be logged in to create an app');
          return;
        }
        
        addApp({
          title,
          description,
          url,
          logoUrl,
          isActive,
          createdBy: user.email,
          users: [
            {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              permission: 'admin'
            }
          ]
        });
      }
      
      navigate('/admin/apps');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save app configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-gray-100 bg-white">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit App' : 'Create New App'}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? 'Update your app configuration and settings' 
              : 'Configure a new app portal for your users'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" required>App Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My App Portal"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your app portal and its purpose"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url" required>URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-100">
                  <ImageWithFallback
                    src={logoUrl}
                    fallbackSrc="/placeholder.svg"
                    alt="App Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Input
                  id="logoUrl"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/path/to/logo.png"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/admin/apps')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditMode ? 'Saving...' : 'Creating...') 
                : (isEditMode ? 'Save Changes' : 'Create App')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AppForm;
