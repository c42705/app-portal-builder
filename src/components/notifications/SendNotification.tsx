
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

/**
 * Form values for sending a notification
 */
interface NotificationFormValues {
  title: string;
  message: string;
}

/**
 * Component for admins to send notifications to users
 */
const SendNotification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { sendNotification } = useNotifications();
  const { user } = useAuth();
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NotificationFormValues>({
    defaultValues: {
      title: '',
      message: ''
    }
  });

  /**
   * Handles form submission to send a notification
   * @param data Form values
   */
  const onSubmit = async (data: NotificationFormValues) => {
    if (user) {
      sendNotification({
        title: data.title,
        message: data.message,
        sender: user.name,
        sentTo: ['1', '2', '3'] // Send to all users (in a real app, this would be dynamic)
      });
      reset();
      setOpen(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Bell className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-2">Send Notification</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Send important notifications to platform users
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Send Notice</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>
                  This notification will be sent to all platform users
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Notification title"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={5}
                    {...register('message', { required: 'Message is required' })}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Send Notification
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SendNotification;
