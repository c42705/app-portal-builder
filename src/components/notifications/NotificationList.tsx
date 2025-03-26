
import React, { useState } from 'react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationModal from './NotificationModal';
import { motion } from 'framer-motion';

/**
 * Component that displays a list of user notifications with unread/all tabs
 */
const NotificationList: React.FC = () => {
  const { getAllNotifications, getUnreadNotifications, markAsRead } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allNotifications = getAllNotifications();
  const unreadNotifications = getUnreadNotifications();

  /**
   * Handles clicking a notification
   * Opens the modal and sets the selected notification
   */
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  /**
   * Renders a single notification item
   */
  const renderNotificationItem = (notification: Notification) => {
    const formattedDate = new Date(notification.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-3"
      >
        <Card 
          className={`cursor-pointer transition hover:shadow-md ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`} 
          onClick={() => handleNotificationClick(notification)}
        >
          <CardHeader className="py-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base flex items-center">
                  {notification.title}
                  {!notification.read && <Badge className="ml-2 bg-blue-500">New</Badge>}
                </CardTitle>
                <CardDescription className="text-sm">
                  From: {notification.sender} • {formattedDate}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <>
      <Tabs defaultValue="unread" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="unread">
            Unread 
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length > 0 ? (
            <div>
              {unreadNotifications.map(renderNotificationItem)}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No unread notifications</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {allNotifications.length > 0 ? (
            <div>
              {allNotifications.map(renderNotificationItem)}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NotificationModal
        notification={selectedNotification}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default NotificationList;
