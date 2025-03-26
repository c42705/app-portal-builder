
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Type definitions
export interface Notification {
  id: string;
  title: string;
  message: string;
  sender: string;
  createdAt: Date;
  read: boolean;
  sentTo: string[];
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  getUnreadNotifications: () => Notification[];
  getAllNotifications: () => Notification[];
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Provider component for notification context
 * Manages notification state and persistence
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        try {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotifications(parsedNotifications);
        } catch (error) {
          console.error('Error parsing notifications:', error);
          setNotifications([]);
        }
      }
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  /**
   * Calculates the number of unread notifications for the current user
   */
  const unreadCount = user 
    ? notifications.filter(n => !n.read && n.sentTo.includes(user.id)).length 
    : 0;

  /**
   * Marks a notification as read
   * @param id Notification ID to mark as read
   */
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  /**
   * Sends a new notification
   * @param notification Notification data to send
   */
  const sendNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    // Generate a unique ID
    const id = Math.random().toString(36).substring(2, 15);
    
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    toast.success('Notification sent successfully');
  };

  /**
   * Gets all unread notifications for the current user
   * @returns Array of unread notifications
   */
  const getUnreadNotifications = () => {
    if (!user) return [];
    return notifications
      .filter(notification => !notification.read && notification.sentTo.includes(user.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  /**
   * Gets all notifications for the current user
   * @returns Array of all notifications
   */
  const getAllNotifications = () => {
    if (!user) return [];
    return notifications
      .filter(notification => notification.sentTo.includes(user.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      sendNotification,
      getUnreadNotifications,
      getAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook for using the notification context
 * @returns Notification context
 * @throws Error if used outside of NotificationProvider
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
