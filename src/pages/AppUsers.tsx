
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import UsersTable from '@/components/app/UsersTable';
import { Button } from '@/components/ui/button';
import { useAppConfig } from '@/contexts/AppConfigContext';
import { toast } from 'sonner';

const AppUsers = () => {
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
    <AdminLayout title={`${app.title}: User Management`}>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="px-0">
          <Link to="/admin/apps">
            <ChevronLeft size={16} className="mr-1" />
            Back to app portals
          </Link>
        </Button>
        
        <UsersTable app={app} />
      </div>
    </AdminLayout>
  );
};

export default AppUsers;
