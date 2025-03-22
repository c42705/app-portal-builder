
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, Users, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppConfig } from '@/contexts/AppConfigContext';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminDashboard = () => {
  const { apps } = useAppConfig();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalUsers = apps.reduce((acc, app) => acc + app.users.length, 0);
  const activeApps = apps.filter(app => app.isActive).length;
  
  // Get most recently updated apps
  const recentApps = [...apps]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Welcome back, {user?.name}
          </h2>
          <Button onClick={() => navigate('/admin/apps/new')}>
            <Plus size={16} className="mr-2" />
            New App Portal
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total App Portals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{apps.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Portals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeApps}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent App Portals</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/apps')}>
                    View all
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Your most recently updated app portals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => navigate(`/admin/apps/edit/${app.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img 
                            src={app.logoUrl} 
                            alt={app.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{app.title}</h3>
                          <p className="text-xs text-gray-500">
                            Updated {new Date(app.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/apps/${app.id}/users`);
                          }}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/portal/${app.id}`, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {recentApps.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No app portals created yet</p>
                      <Button 
                        variant="link" 
                        onClick={() => navigate('/admin/apps/new')}
                        className="mt-2"
                      >
                        Create your first app portal
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apps.length > 0 ? (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 bg-blue-100 text-blue-600 rounded-full p-1.5">
                          <Settings className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="text-sm">App portal updated</p>
                          <p className="text-xs text-gray-500">
                            {recentApps[0]?.title} was updated {' '}
                            {new Date(recentApps[0]?.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1.5">
                          <Users className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="text-sm">Users added</p>
                          <p className="text-xs text-gray-500">
                            New users were added to your portals
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/admin/settings')}
                >
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
