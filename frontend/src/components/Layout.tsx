import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import { useApp } from '@/contexts/AppContext';
import { useWallet } from '@/contexts/WalletContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useApp();
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Header />
      
      <div className="flex">
        {isConnected && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block"
          >
            <Sidebar />
          </motion.div>
        )}
        
        <main className={`flex-1 ${isConnected ? 'lg:ml-64' : ''}`}>
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {state.loading.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
                  <div className="flex items-center space-x-3">
                    <div className="loading-spinner"></div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {state.loading.loadingText || 'Loading...'}
                      </p>
                      <p className="text-sm text-neutral-600">
                        Please wait while we process your request
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
