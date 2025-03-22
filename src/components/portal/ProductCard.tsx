
import React, { useState } from 'react';
import { HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  year?: string;
  onClick?: () => void;
  active?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  subtitle,
  image,
  year,
  onClick,
  active = false,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        className={cn(
          "overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-all cursor-pointer",
          active && "border-blue-200 shadow-md"
        )}
        onClick={onClick}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="h-32 w-full flex items-center justify-center">
              <img 
                src={image} 
                alt={title}
                className="max-h-full max-w-full object-contain" 
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full hover:bg-gray-100",
                isLiked && "text-red-500"
              )}
              onClick={handleLike}
            >
              <HeartIcon
                size={18}
                className={cn(
                  "transition-all",
                  isLiked ? "fill-red-500" : "fill-none"
                )}
              />
            </Button>
          </div>
          
          <div className="text-center">
            <h3 className="font-medium text-sm">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {year && <p className="text-xs text-gray-400 mt-1">{year}</p>}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
