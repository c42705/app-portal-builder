
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import NotificationList from '@/components/notifications/NotificationList';

/**
 * Notifications page that displays all user notifications
 */
const Notifications = () => {
  return (
    <AdminLayout title="Notifications">
      <div className="space-y-6">
        <NotificationList />
      </div>
    </AdminLayout>
  );
};

export default Notifications;
