import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/globals.css';

// Components
import Layout from '@/components/Layout';
import { AppProvider } from '@/contexts/AppContext';
import { WalletProvider } from '@/contexts/WalletContext';
import LoadingScreen from '@/components/LoadingScreen';

interface MyAppProps extends AppProps {
  Component: AppProps['Component'] & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  };
}

function MyApp({ Component, pageProps, router }: MyAppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <WalletProvider>
      <AppProvider>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={router.route}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {getLayout(<Component {...pageProps} />)}
          </motion.div>
        </AnimatePresence>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'bg-white shadow-lg border',
            style: {
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </AppProvider>
    </WalletProvider>
  );
}

export default MyApp;
