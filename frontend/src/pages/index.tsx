import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ClockIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@/contexts/WalletContext';

const Home: React.FC = () => {
  const { isConnected, connect } = useWallet();

  const features = [
    {
      icon: ClockIcon,
      title: 'Time-Based Economy',
      description: 'Exchange skills and services using time as currency. Everyone\'s hour is valued equally.',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Trustless',
      description: 'Built on Stacks blockchain with smart contracts ensuring secure, verifiable transactions.',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: AcademicCapIcon,
      title: 'Skill Verification',
      description: 'Decentralized skill verification system with expert-based attestations.',
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Network',
      description: 'Connect with skilled individuals worldwide in a decentralized marketplace.',
      color: 'from-warning-500 to-warning-600',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '2.5K+', icon: UsersIcon },
    { label: 'Skills Exchanged', value: '50+', icon: AcademicCapIcon },
    { label: 'Hours Traded', value: '12K+', icon: ClockIcon },
    { label: 'Success Rate', value: '98%', icon: CheckCircleIcon },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Connect Your Wallet',
      description: 'Connect your Stacks wallet to join the TimeBank network.',
    },
    {
      step: 2,
      title: 'Register Your Skills',
      description: 'List your skills and expertise to offer services to others.',
    },
    {
      step: 3,
      title: 'Start Trading Time',
      description: 'Exchange your time for others\' skills and build your reputation.',
    },
    {
      step: 4,
      title: 'Earn & Learn',
      description: 'Grow your skill set while earning time credits for your services.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mr-4"
                >
                  <ClockIcon className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-5xl font-bold text-gradient">TimeBank</h1>
              </div>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                The world's first decentralized time banking protocol. Trade skills, exchange expertise, 
                and build meaningful connections using time as currency.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              {isConnected ? (
                <Link href="/dashboard" className="btn-primary btn-lg">
                  Go to Dashboard
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <button onClick={connect} className="btn-primary btn-lg">
                  Connect Wallet & Start
                  <SparklesIcon className="w-5 h-5 ml-2" />
                </button>
              )}
              <Link href="/marketplace" className="btn-outline btn-lg">
                Explore Marketplace
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center p-6 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Why Choose TimeBank?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Built on blockchain technology with a focus on fairness, security, and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                <div className="card hover-lift h-full">
                  <div className="card-body text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              How TimeBank Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Get started in four simple steps and begin trading your time and skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {step.description}
                </p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full">
                    <ArrowRightIcon className="w-6 h-6 text-neutral-300 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Trading Time?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Join thousands of skilled individuals already exchanging expertise on TimeBank.
            </p>
            {!isConnected && (
              <button
                onClick={connect}
                className="btn bg-white text-primary-600 hover:bg-primary-50 btn-lg"
              >
                Connect Wallet & Join Now
                <SparklesIcon className="w-5 h-5 ml-2" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <ClockIcon className="w-8 h-8 text-primary-400" />
                <span className="text-xl font-bold">TimeBank</span>
              </div>
              <p className="text-neutral-400 max-w-md">
                Decentralized time banking protocol built on Stacks blockchain. 
                Trade skills, exchange expertise, and build meaningful connections.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/skills" className="hover:text-white transition-colors">Skills</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 TimeBank. Built with ❤️ on Stacks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Use a custom layout for the landing page
// Home.getLayout = (page: React.ReactElement) => page;

export default Home;
