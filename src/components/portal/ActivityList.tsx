
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed' | 'open';
  icon?: React.ReactNode;
}

interface ActivityListProps {
  title: string;
  items: ActivityItem[];
  showAddButton?: boolean;
  onAddClick?: () => void;
  emptyMessage?: string;
}

const ActivityList: React.FC<ActivityListProps> = ({
  title,
  items,
  showAddButton = false,
  onAddClick,
  emptyMessage = 'No items to display',
}) => {
  const getStatusClass = (status: ActivityItem['status']) => {
    switch (status) {
      case 'in-progress':
        return 'bg-orange-100 text-orange-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'open':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: ActivityItem['status']) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'open':
        return 'Open';
      default:
        return 'Pending';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="overflow-hidden border border-gray-100 bg-white">
      <CardHeader className="px-6 py-4 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {showAddButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8"
            onClick={onAddClick}
          >
            <PlusCircle size={18} className="text-blue-600" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-6 py-2">
        {items.length > 0 ? (
          <motion.ul 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {items.map((item) => (
              <motion.li key={item.id} className="flex items-center" variants={item}>
                {item.icon && (
                  <div className="mr-3 flex-shrink-0">{item.icon}</div>
                )}
                <div className="flex-grow">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time} ago</p>
                </div>
                <Badge className={cn("ml-2", getStatusClass(item.status))}>
                  {getStatusText(item.status)}
                </Badge>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        )}
        {items.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-xs text-gray-500 py-2">
            <Button variant="link" size="sm" className="px-0 h-auto text-xs text-gray-500">
              View All
            </Button>
            <span>First 6 of 16</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityList;
