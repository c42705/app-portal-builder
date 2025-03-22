
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, Check, Plane, Diamond, GoogleDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppConfig } from '@/contexts/AppConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AppHeader from '@/components/portal/AppHeader';
import Carousel from '@/components/portal/Carousel';
import ProductCard from '@/components/portal/ProductCard';
import ServiceCard from '@/components/portal/ServiceCard';
import ActivityList from '@/components/portal/ActivityList';
import { motion } from 'framer-motion';

const Portal = () => {
  const { id } = useParams<{ id: string }>();
  const { apps } = useAppConfig();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const app = apps.find(app => app.id === id);
  const [loading, setLoading] = useState(true);
  
  // Sample data for the carousel
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
  
  // Sample activity items
  const activityItems = [
    {
      id: '1',
      title: '2 requested items',
      time: '3 min',
      status: 'in-progress' as const,
      icon: <Plane className="h-5 w-5 text-blue-500" />,
    },
    {
      id: '2',
      title: 'Sketch',
      time: '4 min',
      status: 'in-progress' as const,
      icon: <Diamond className="h-5 w-5 text-orange-500" />,
    },
    {
      id: '3',
      title: 'Flights to New York',
      time: '7 min',
      status: 'open' as const,
      icon: <Plane className="h-5 w-5 text-blue-500" />,
    },
    {
      id: '4',
      title: '1893 Citrus Pepsi',
      time: '15 min',
      status: 'open' as const,
      icon: <div className="h-5 w-5 rounded-full overflow-hidden">
        <img src="https://logo.clearbit.com/pepsico.com" alt="Pepsi" className="h-full w-full object-cover" />
      </div>,
    },
    {
      id: '5',
      title: 'Table Lamp - Ikea',
      time: '27 min',
      status: 'open' as const,
      icon: <div className="h-5 w-5 rounded-full overflow-hidden">
        <img src="https://logo.clearbit.com/ikea.com" alt="Ikea" className="h-full w-full object-cover" />
      </div>,
    },
    {
      id: '6',
      title: 'Access to Google Drive',
      time: '57 min',
      status: 'open' as const,
      icon: <GoogleDrive className="h-5 w-5 text-yellow-500" />,
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
  
  if (loading || !app || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
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
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* App Header Section */}
        <AppHeader app={app} />
        
        {/* Carousel Section */}
        <Carousel items={carouselItems} />
        
        {/* Suggested Items Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Suggested items for you</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <ProductCard
              id="1"
              title="MacBook Pro 15""
              subtitle="2019"
              image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16touch-space-select-201911?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1572825197207"
            />
            <ProductCard
              id="2"
              title="iMac 27""
              subtitle="2019"
              image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-27-cto-hero-201903?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1553120926105"
              active={true}
            />
            <ProductCard
              id="3"
              title="iPhone XS"
              subtitle="64 gb"
              image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-xs-gold-select-2018?wid=940&hei=1112&fmt=png-alpha&.v=1550795750511"
            />
            <ProductCard
              id="4"
              title="Apple Watch 3 38mm"
              subtitle="2019"
              image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/42-alu-silver-sport-white-nc-s3-grid?wid=540&hei=550&fmt=jpeg&qlt=90&.v=1594259786000"
            />
          </div>
        </div>
        
        {/* Service Access Section */}
        <div className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <ServiceCard
              title="Access to Pepsi"
              value="9,331"
              icon={
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img src="https://logo.clearbit.com/pepsico.com" alt="Pepsi" className="h-full w-full object-cover" />
                </div>
              }
            />
            <ServiceCard
              title="Access to Google Drive"
              value="11"
              icon={<GoogleDrive size={32} className="text-yellow-500" />}
            />
            <ServiceCard
              title="Access to Slack"
              value="Plus"
              icon={
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img src="https://logo.clearbit.com/slack.com" alt="Slack" className="h-full w-full object-cover" />
                </div>
              }
            />
            <ServiceCard
              title="Access to Sketch"
              value="52"
              icon={<Diamond size={32} className="text-blue-500" />}
            />
          </div>
        </div>
        
        {/* Activity Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            <ActivityList 
              title="My Items" 
              items={activityItems} 
              showAddButton={true}
            />
          </div>
          <div className="col-span-1 space-y-6">
            <ActivityList 
              title="My To - Dos" 
              items={[]} 
              showAddButton={true}
              emptyMessage="You currently have no To - Dos"
            />
          </div>
          <div className="col-span-1 space-y-6">
            <ActivityList 
              title="Top Rated Articles" 
              items={[]} 
              emptyMessage="No articles available"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portal;
