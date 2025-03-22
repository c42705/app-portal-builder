
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/portal/ProductCard';

/**
 * Container component that renders the suggested products section
 * Displays a grid of ProductCard components with animation
 */
const ProductsSection: React.FC = () => {
  return (
    <motion.div 
      className="mb-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Suggested items for you</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard
          id="1"
          title="MacBook Pro 15&quot;"
          subtitle="2019"
          image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16touch-space-select-201911?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1572825197207"
        />
        <ProductCard
          id="2"
          title="iMac 27&quot;"
          subtitle="2019"
          image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-27-cto-hero-201903?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1553120926105"
          active={true}
        />
        <ProductCard
          id="3"
          title="iPhone XS"
          subtitle="64 gb"
          image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-xs-gold-select-2018?wid=940&hei=1112&fmt=png-alpha&.v=1550795750511"
        />
        <ProductCard
          id="4"
          title="Apple Watch 3 38mm"
          subtitle="2019"
          image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/42-alu-silver-sport-white-nc-s3-grid?wid=540&hei=550&fmt=jpeg&qlt=90&.v=1594259786000"
        />
      </div>
    </motion.div>
  );
};

export default ProductsSection;
