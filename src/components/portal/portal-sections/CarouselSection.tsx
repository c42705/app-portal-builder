
import React from 'react';
import { motion } from 'framer-motion';
import Carousel from '@/components/portal/Carousel';

/**
 * Container component that renders the carousel section of the portal
 * Utilizes the Carousel component with animation
 * @param items - The carousel items to display
 */
interface CarouselSectionProps {
  items: {
    id: string;
    image: string;
    title: string;
    subtitle: string;
  }[];
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ items }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Carousel items={items} />
    </motion.div>
  );
};

export default CarouselSection;
