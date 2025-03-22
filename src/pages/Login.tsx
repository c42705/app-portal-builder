
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to admin dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            App Portal Builder
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Create, customize, and manage your app portals from a single dashboard.
          </p>
          <div className="bg-white rounded-xl shadow-soft p-4 mb-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">✓</span>
                Create beautiful app portals
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">✓</span>
                Customize logos, titles, and URLs
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">✓</span>
                Manage user permissions
              </li>
              <li className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">✓</span>
                Track user activity and engagement
              </li>
            </ul>
          </div>
        </motion.div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
