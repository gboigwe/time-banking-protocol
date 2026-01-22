import React from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { UserProfile } from '@/types';
import { formatPrincipal } from '@/lib/stacks';

interface ProviderCardProps {
  provider: UserProfile;
  index: number;
  isConnected: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, index, isConnected }) => {
  return (
    <motion.div
      key={provider.principal}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="card hover-lift"
    >
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center overflow-hidden">
              {provider.avatar ? (
                <img
                  src={provider.avatar}
                  alt={provider.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 flex items-center space-x-1">
                <span>{provider.displayName}</span>
                {provider.skills.some(skill => skill.verified) && (
                  <CheckBadgeIcon className="w-4 h-4 text-primary-500" />
                )}
              </h3>
              <p className="text-sm text-neutral-500">
                {formatPrincipal(provider.principal)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-warning-500 fill-current" />
            <span className="text-sm font-medium text-neutral-700">
              {provider.user.reputationScore}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
          {provider.bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {provider.skills.slice(0, 3).map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className={`badge ${skill.verified ? 'badge-primary' : 'badge-neutral'} text-xs`}
            >
              {skill.skill}
              {skill.verified && (
                <CheckBadgeIcon className="w-3 h-3 ml-1" />
              )}
            </span>
          ))}
          {provider.skills.length > 3 && (
            <span className="badge badge-neutral text-xs">
              +{provider.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4" />
            <span>{provider.user.totalHoursGiven} hrs given</span>
          </div>
          <div className="flex items-center space-x-1">
            <CalendarIcon className="w-4 h-4" />
            <span>
              {Math.floor((Date.now() - provider.user.joinedAt) / 86400000)} days
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            className="btn-primary flex-1"
            disabled={!isConnected}
          >
            Request Service
          </button>
          <button className="btn-outline flex items-center justify-center w-10 h-10">
            <ChartBarIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProviderCard;