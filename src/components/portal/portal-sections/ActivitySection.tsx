
import React from 'react';
import { Diamond, Plane, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ActivityList from '@/components/portal/ActivityList';

/**
 * Container component that renders the activity lists section
 * Displays three activity lists with animation
 */
const ActivitySection: React.FC = () => {
  // Sample activity items
  const activityItems = [
    {
      id: '1',
      title: '2 requested items',
      time: '3 min',
      status: 'in-progress' as const,
      icon: <Plane className="h-5 w-5 text-blue-500" />,
    },
    {
      id: '2',
      title: 'Sketch',
      time: '4 min',
      status: 'in-progress' as const,
      icon: <Diamond className="h-5 w-5 text-orange-500" />,
    },
    {
      id: '3',
      title: 'Flights to New York',
      time: '7 min',
      status: 'open' as const,
      icon: <Plane className="h-5 w-5 text-blue-500" />,
    },
    {
      id: '4',
      title: '1893 Citrus Pepsi',
      time: '15 min',
      status: 'open' as const,
      icon: <div className="h-5 w-5 rounded-full overflow-hidden">
        <img src="https://logo.clearbit.com/pepsico.com" alt="Pepsi" className="h-full w-full object-cover" />
      </div>,
    },
    {
      id: '5',
      title: 'Table Lamp - Ikea',
      time: '27 min',
      status: 'open' as const,
      icon: <div className="h-5 w-5 rounded-full overflow-hidden">
        <img src="https://logo.clearbit.com/ikea.com" alt="Ikea" className="h-full w-full object-cover" />
      </div>,
    },
    {
      id: '6',
      title: 'Access to Google Drive',
      time: '57 min',
      status: 'open' as const,
      icon: <FileText className="h-5 w-5 text-yellow-500" />,
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <div className="col-span-1 space-y-6">
        <ActivityList 
          title="My Items" 
          items={activityItems} 
          showAddButton={true}
        />
      </div>
      <div className="col-span-1 space-y-6">
        <ActivityList 
          title="My To - Dos" 
          items={[]} 
          showAddButton={true}
          emptyMessage="You currently have no To - Dos"
        />
      </div>
      <div className="col-span-1 space-y-6">
        <ActivityList 
          title="Top Rated Articles" 
          items={[]} 
          emptyMessage="No articles available"
        />
      </div>
    </motion.div>
  );
};

export default ActivitySection;
