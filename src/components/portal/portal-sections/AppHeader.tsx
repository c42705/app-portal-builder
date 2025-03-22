
import React from 'react';
import { AppConfig } from '@/contexts/AppConfigContext';
import { motion } from 'framer-motion';
import AppHeaderComponent from '@/components/portal/AppHeader';

/**
 * Container component that renders the app header section of the portal
 * Utilizes the AppHeader component with animation
 * @param app - The app configuration object
 */
interface AppHeaderSectionProps {
  app: AppConfig;
}

const AppHeaderSection: React.FC<AppHeaderSectionProps> = ({ app }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <AppHeaderComponent app={app} />
    </motion.div>
  );
};

export default AppHeaderSection;
