
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  icon?: React.ReactNode;
  title: string;
  value?: string | number;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  value,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        className="overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-all cursor-pointer p-5"
        onClick={onClick}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="h-10 w-10 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <p className="font-medium text-sm">{title}</p>
              {value && <p className="text-xs text-gray-500 mt-0.5">{value}</p>}
            </div>
          </div>
          
          <Badge variant="secondary" className="px-3 py-1 text-xs bg-gray-100">
            {typeof value === 'number' ? value : 'Access'}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
