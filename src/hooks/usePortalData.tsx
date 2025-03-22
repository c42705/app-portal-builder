
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppConfig } from '@/contexts/AppConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Custom hook to handle portal data and access permissions
 * Checks if the current user has access to the requested app portal
 * Returns loading state, app data, and authentication state
 */
export const usePortalData = () => {
  const { id } = useParams<{ id: string }>();
  const { apps } = useAppConfig();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const app = apps.find(app => app.id === id);

  // Sample carousel data
  const carouselItems = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&h=400&fit=crop',
      title: 'Article Headline',
      subtitle: 'Lorem Ipsum',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop',
      title: 'Technology Resources',
      subtitle: 'Available for your team',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?w=800&h=400&fit=crop',
      title: 'Latest Updates',
      subtitle: 'Check what\'s new',
    },
  ];

  // Check if user has permission to access this app
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }

    if (!app) {
      toast.error('App portal not found');
      navigate('/');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to access this portal');
      navigate('/login');
      return;
    }
    
    const userHasAccess = app.users.some(u => u.email === user.email);
    if (!userHasAccess) {
      toast.error('You do not have permission to access this portal');
      navigate('/');
    }
  }, [app, user, navigate, loading]);

  return {
    loading,
    app,
    user,
    carouselItems
  };
};
