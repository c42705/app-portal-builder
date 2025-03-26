
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, ExternalLink, Users, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAppConfig, AppConfig } from '@/contexts/AppConfigContext';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';

interface AppCardProps {
  app: AppConfig;
}

/**
 * AppCard component that displays an app with role-based interactions
 * @param {AppConfig} app - The app configuration to display
 */
const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const { deleteApp } = useAppConfig();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  /**
   * Handles editing the app (admin only)
   */
  const handleEdit = () => {
    navigate(`/admin/apps/edit/${app.id}`);
  };

  /**
   * Handles managing app users (admin only)
   */
  const handleUsers = () => {
    navigate(`/admin/apps/${app.id}/users`);
  };

  /**
   * Opens the app URL in a new tab
   */
  const handleOpenApp = () => {
    window.open(app.url, '_blank');
  };

  /**
   * Formats a date for display
   * @param date Date to format
   * @returns Formatted date string
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <Card 
          className="h-full flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all cursor-pointer"
          onClick={handleOpenApp}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-100 dark:border-gray-700">
                  <ImageWithFallback
                    src={app.logoUrl}
                    fallbackSrc="/placeholder.svg"
                    alt={app.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium">{app.title}</CardTitle>
                  <CardDescription className="text-xs truncate max-w-[200px]">
                    {app.url}
                  </CardDescription>
                </div>
              </div>
              {isAdmin() && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical size={16} />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                      <Edit size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUsers(); }}>
                      <Users size={14} className="mr-2" />
                      Manage users
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); handleOpenApp(); }}
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <ExternalLink size={14} className="mr-2" />
                      Visit portal
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); setOpenDeleteDialog(true); }}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          <CardContent className="py-3 flex-grow">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{app.description}</p>
          </CardContent>
          <CardFooter className="pt-0 flex items-center justify-between">
            {isAdmin() && (
              <Badge variant={app.isActive ? "default" : "outline"} className="text-xs">
                {app.isActive ? 'Active' : 'Inactive'}
              </Badge>
            )}
            {!isAdmin() && app.isActive && (
              <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                Active
              </Badge>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Updated {formatDate(app.updatedAt)}
            </span>
          </CardFooter>
        </Card>
      </motion.div>

      {isAdmin() && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the <strong>{app.title}</strong> app portal and all associated user permissions.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteApp(app.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default AppCard;
