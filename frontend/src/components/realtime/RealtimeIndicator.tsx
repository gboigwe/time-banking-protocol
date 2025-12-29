/**
 * RealtimeIndicator Component
 * Shows connection status and sync information
 */

import { ConnectionStatus } from '@/types/realtime';

interface RealtimeIndicatorProps {
  status: ConnectionStatus;
  queuedItems?: number;
  onRetry?: () => void;
  compact?: boolean;
}

export default function RealtimeIndicator({
  status,
  queuedItems = 0,
  onRetry,
  compact = false,
}: RealtimeIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return {
          color: 'bg-green-500',
          text: 'Connected',
          icon: '✓',
          pulse: false,
        };
      case ConnectionStatus.CONNECTING:
        return {
          color: 'bg-yellow-500',
          text: 'Connecting...',
          icon: '⟳',
          pulse: true,
        };
      case ConnectionStatus.RECONNECTING:
        return {
          color: 'bg-yellow-500',
          text: 'Reconnecting...',
          icon: '⟳',
          pulse: true,
        };
      case ConnectionStatus.DISCONNECTED:
        return {
          color: 'bg-gray-500',
          text: 'Disconnected',
          icon: '○',
          pulse: false,
        };
      case ConnectionStatus.ERROR:
        return {
          color: 'bg-red-500',
          text: 'Error',
          icon: '✕',
          pulse: false,
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Unknown',
          icon: '?',
          pulse: false,
        };
    }
  };

  const config = getStatusConfig();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
        {queuedItems > 0 && (
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {queuedItems} pending
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {config.text}
        </span>
      </div>

      {queuedItems > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {queuedItems} queued
          </span>
        </div>
      )}

      {status === ConnectionStatus.ERROR && onRetry && (
        <button
          onClick={onRetry}
          className="px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Compact version for navbar
 */
export function RealtimeStatusDot({ status }: { status: ConnectionStatus }) {
  const getColor = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return 'bg-green-500';
      case ConnectionStatus.CONNECTING:
      case ConnectionStatus.RECONNECTING:
        return 'bg-yellow-500';
      case ConnectionStatus.ERROR:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isAnimated = [
    ConnectionStatus.CONNECTING,
    ConnectionStatus.RECONNECTING,
  ].includes(status);

  return (
    <div
      className={`w-2 h-2 rounded-full ${getColor()} ${
        isAnimated ? 'animate-pulse' : ''
      }`}
      title={status}
    />
  );
}
