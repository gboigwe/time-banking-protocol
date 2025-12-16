import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useChainhookEvents, ChainhookEvent } from '@/hooks/useChainhookEvents';
import { formatPrincipal, formatTimestamp } from '@/lib/stacks';

interface RealtimeActivityFeedProps {
  limit?: number;
  showNotifications?: boolean;
  className?: string;
}

export const RealtimeActivityFeed: React.FC<RealtimeActivityFeedProps> = ({
  limit = 10,
  showNotifications = true,
  className = '',
}) => {
  const { events, isLoading, error, latestEvent } = useChainhookEvents({ limit });
  const [lastSeenEvent, setLastSeenEvent] = useState<ChainhookEvent | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Show toast notification for new events
  useEffect(() => {
    if (latestEvent && latestEvent !== lastSeenEvent && showNotifications) {
      setShowToast(true);
      setLastSeenEvent(latestEvent);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [latestEvent, lastSeenEvent, showNotifications]);

  const getEventIcon = (event: ChainhookEvent) => {
    if (event.success) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    return <XCircleIcon className="w-5 h-5 text-red-500" />;
  };

  const getEventDescription = (event: ChainhookEvent): string => {
    if (event.topic) {
      switch (event.topic) {
        case 'user-registered':
          return 'New user registered';
        case 'exchange-created':
          return 'Exchange request created';
        case 'exchange-completed':
          return 'Exchange completed';
        case 'skill-verified':
          return 'Skill verified';
        case 'reputation-updated':
          return 'Reputation updated';
        case 'escrow-created':
          return 'Escrow created';
        case 'escrow-released':
          return 'Escrow released';
        case 'vote-cast':
          return 'Vote cast on proposal';
        case 'reward-claimed':
          return 'Reward claimed';
        default:
          return event.topic;
      }
    }

    if (event.type === 'stx_transfer_event') {
      return `STX transfer: ${event.amount}`;
    }

    if (event.type === 'ft_transfer_event') {
      return 'Token transfer';
    }

    return event.type;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Toast Notification for new events */}
      <AnimatePresence>
        {showToast && latestEvent && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg p-4 border border-primary-200 max-w-md"
          >
            <div className="flex items-start space-x-3">
              <BellIcon className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">New Activity</p>
                <p className="text-sm text-gray-600">{getEventDescription(latestEvent)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Block #{latestEvent.blockHeight}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Live Activity Feed
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoading && events.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-xs text-gray-400 mt-1">
                Events will appear here in real-time
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {events.map((event, index) => (
                <motion.div
                  key={`${event.txHash}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getEventIcon(event)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {getEventDescription(event)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        From: {formatPrincipal(event.sender)}
                      </p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                        <span>Block #{event.blockHeight}</span>
                        <span>•</span>
                        <span>{formatTimestamp(event.timestamp)}</span>
                        {event.success && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">Success</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
