
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import AppForm from '@/components/app/AppForm';
import { useAppConfig } from '@/contexts/AppConfigContext';
import { toast } from 'sonner';

const AppEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { apps } = useAppConfig();
  const navigate = useNavigate();
  
  const app = apps.find(app => app.id === id);
  
  useEffect(() => {
    if (id && !app) {
      toast.error('App not found');
      navigate('/admin/apps');
    }
  }, [id, app, navigate]);
  
  if (!app) {
    return null;
  }
  
  return (
    <AdminLayout title={`Edit: ${app.title}`}>
      <AppForm existingApp={app} />
    </AdminLayout>
  );
};

export default AppEdit;
