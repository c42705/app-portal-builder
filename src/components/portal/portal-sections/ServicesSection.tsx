
import React from 'react';
import { Diamond, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/portal/ServiceCard';

/**
 * Container component that renders the service access section
 * Displays a grid of ServiceCard components with animation
 */
const ServicesSection: React.FC = () => {
  return (
    <motion.div 
      className="mb-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ServiceCard
          title="Access to Pepsi"
          value="9,331"
          icon={
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img src="https://logo.clearbit.com/pepsico.com" alt="Pepsi" className="h-full w-full object-cover" />
            </div>
          }
        />
        <ServiceCard
          title="Access to Google Drive"
          value="11"
          icon={<FileText size={32} className="text-yellow-500" />}
        />
        <ServiceCard
          title="Access to Slack"
          value="Plus"
          icon={
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img src="https://logo.clearbit.com/slack.com" alt="Slack" className="h-full w-full object-cover" />
            </div>
          }
        />
        <ServiceCard
          title="Access to Sketch"
          value="52"
          icon={<Diamond size={32} className="text-blue-500" />}
        />
      </div>
    </motion.div>
  );
};

export default ServicesSection;
