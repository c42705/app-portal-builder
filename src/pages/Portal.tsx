
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortalData } from '@/hooks/usePortalData';
import LoadingSpinner from '@/components/portal/LoadingSpinner';
import PortalHeader from '@/components/portal/PortalHeader';
import AppHeaderSection from '@/components/portal/portal-sections/AppHeader';
import CarouselSection from '@/components/portal/portal-sections/CarouselSection';
import ProductsSection from '@/components/portal/portal-sections/ProductsSection';
import ServicesSection from '@/components/portal/portal-sections/ServicesSection';
import ActivitySection from '@/components/portal/portal-sections/ActivitySection';

/**
 * Portal component that displays a dynamic app portal based on the app ID
 * Handles permissions, loading states, and displays app content
 */
const Portal: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { loading, app, user, carouselItems } = usePortalData();
  
  // Handle logout action
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Show loading spinner while data is being fetched
  if (loading || !app || !user) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader app={app} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6">
        {/* App Header Section */}
        <AppHeaderSection app={app} />
        
        {/* Carousel Section */}
        <CarouselSection items={carouselItems} />
        
        {/* Suggested Items Section */}
        <ProductsSection />
        
        {/* Service Access Section */}
        <ServicesSection />
        
        {/* Activity Lists */}
        <ActivitySection />
      </main>
    </div>
  );
};

export default Portal;
