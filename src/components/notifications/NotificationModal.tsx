
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Notification, useNotifications } from '@/contexts/NotificationContext';

/**
 * Modal component to display notification details
 */
interface NotificationModalProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction?: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  open,
  onOpenChange,
  onAction
}) => {
  const { markAsRead } = useNotifications();

  /**
   * Handles clicking the "I Understand" button
   * Marks the notification as read and closes the modal
   */
  const handleUnderstand = () => {
    if (notification) {
      markAsRead(notification.id);
      onOpenChange(false);
    }
  };

  /**
   * Handles clicking the "Ask Questions" button
   * Keeps the notification unread and triggers the action
   */
  const handleAskQuestions = () => {
    if (onAction) {
      onAction();
    }
    onOpenChange(false);
  };

  /**
   * Formats the date for display
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {notification && (
          <>
            <DialogHeader>
              <DialogTitle>{notification.title}</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                <span>From: {notification.sender}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(notification.createdAt)}
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="whitespace-pre-line">{notification.message}</p>
            </div>
            <DialogFooter className="flex sm:justify-between">
              <Button 
                variant="outline" 
                onClick={handleAskQuestions}
              >
                Ask Questions
              </Button>
              <Button 
                onClick={handleUnderstand}
              >
                I Understand
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
