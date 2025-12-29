import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './dashboard';

// Mock Next.js router and Link
vi.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/dashboard',
    push: vi.fn(),
    query: {},
    asPath: '/dashboard',
  }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock contexts
const mockLoadUserInfo = vi.fn();
const mockLoadStats = vi.fn();
const mockLoadExchangeStats = vi.fn();

const mockWalletContext = {
  isConnected: true,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
};

const mockAppContext = {
  state: {
    user: {
      principal: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      displayName: 'John Doe',
    },
  },
};

const mockTimeBankCore = {
  user: {
    timeBalance: 25,
    totalHoursGiven: 10,
    totalHoursReceived: 15,
    reputationScore: 85,
  },
  stats: {
    totalUsers: 100,
    activeUsers: 45,
  },
  loadUserInfo: mockLoadUserInfo,
  loadStats: mockLoadStats,
};

const mockExchangeManager = {
  loadExchangeStats: mockLoadExchangeStats,
};

vi.mock('@/contexts/WalletContext', () => ({
  useWallet: () => mockWalletContext,
}));

vi.mock('@/contexts/AppContext', () => ({
  useApp: () => mockAppContext,
}));

vi.mock('@/hooks/useTimeBankCore', () => ({
  useTimeBankCore: () => mockTimeBankCore,
}));

vi.mock('@/hooks/useExchangeManager', () => ({
  useExchangeManager: () => mockExchangeManager,
}));

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWalletContext.isConnected = true;
    mockWalletContext.address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    mockTimeBankCore.user = {
      timeBalance: 25,
      totalHoursGiven: 10,
      totalHoursReceived: 15,
      reputationScore: 85,
    };
    mockLoadStats.mockResolvedValue({
      totalUsers: 100,
      activeUsers: 45,
    });
    mockLoadExchangeStats.mockResolvedValue({});
  });

  describe('Not Connected State', () => {
    it('should show "Connect Your Wallet" message when wallet is not connected', () => {
      mockWalletContext.isConnected = false;
      mockWalletContext.address = null;

      render(<Dashboard />);

      expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
      expect(
        screen.getByText('Please connect your wallet to access your dashboard')
      ).toBeInTheDocument();
      expect(screen.getByText('Go to Home')).toBeInTheDocument();
    });

    it('should not show dashboard content when not connected', () => {
      mockWalletContext.isConnected = false;

      render(<Dashboard />);

      expect(screen.queryByText('Welcome back')).not.toBeInTheDocument();
    });
  });

  describe('Connected State - User Registered', () => {
    it('should display welcome message with user name', () => {
      render(<Dashboard />);

      expect(screen.getByText(/Welcome back, John Doe!/)).toBeInTheDocument();
      expect(
        screen.getByText(/Here's what's happening with your time banking activities/)
      ).toBeInTheDocument();
    });

    it('should load user info and stats on mount', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(mockLoadUserInfo).toHaveBeenCalledTimes(1);
        expect(mockLoadStats).toHaveBeenCalledTimes(1);
        expect(mockLoadExchangeStats).toHaveBeenCalledTimes(1);
      });
    });

    it('should display time balance stat', () => {
      render(<Dashboard />);

      expect(screen.getByText('Time Balance')).toBeInTheDocument();
      expect(screen.getByText('25 hrs')).toBeInTheDocument();
    });

    it('should display hours given stat', () => {
      render(<Dashboard />);

      expect(screen.getByText('Hours Given')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should display hours received stat', () => {
      render(<Dashboard />);

      expect(screen.getByText('Hours Received')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('should display reputation score', () => {
      render(<Dashboard />);

      expect(screen.getByText('Reputation')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
    });

    it('should display total users and active users', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/100 total users • 45 active/)).toBeInTheDocument();
      });
    });

    it('should not show registration prompt when user is registered', () => {
      render(<Dashboard />);

      expect(screen.queryByText('Welcome to TimeBank!')).not.toBeInTheDocument();
      expect(screen.queryByText('Register Now')).not.toBeInTheDocument();
    });
  });

  describe('Connected State - User Not Registered', () => {
    beforeEach(() => {
      mockTimeBankCore.user = null;
    });

    it('should show registration prompt when user is not registered', () => {
      render(<Dashboard />);

      expect(screen.getByText('Welcome to TimeBank!')).toBeInTheDocument();
      expect(
        screen.getByText(
          'You need to register to start using the Time Banking Protocol'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Register Now')).toBeInTheDocument();
    });

    it('should still show quick stats with zero values', () => {
      render(<Dashboard />);

      expect(screen.getByText('Time Balance')).toBeInTheDocument();
      expect(screen.getByText('0 hrs')).toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('should display all quick action cards', () => {
      render(<Dashboard />);

      expect(screen.getByText('Create Exchange')).toBeInTheDocument();
      expect(screen.getByText('Browse Skills')).toBeInTheDocument();
      expect(screen.getByText('Manage Skills')).toBeInTheDocument();
      expect(screen.getByText('View Analytics')).toBeInTheDocument();
    });

    it('should display quick action descriptions', () => {
      render(<Dashboard />);

      expect(screen.getByText('Offer your skills to others')).toBeInTheDocument();
      expect(screen.getByText('Find experts to help you')).toBeInTheDocument();
      expect(screen.getByText('Update your skill portfolio')).toBeInTheDocument();
      expect(screen.getByText('Track your progress')).toBeInTheDocument();
    });

    it('should link to correct pages', () => {
      render(<Dashboard />);

      const createExchangeLink = screen
        .getByText('Create Exchange')
        .closest('a');
      const browseSkillsLink = screen
        .getByText('Browse Skills')
        .closest('a');
      const manageSkillsLink = screen
        .getByText('Manage Skills')
        .closest('a');
      const viewAnalyticsLink = screen
        .getByText('View Analytics')
        .closest('a');

      expect(createExchangeLink).toHaveAttribute('href', '/exchanges/create');
      expect(browseSkillsLink).toHaveAttribute('href', '/marketplace');
      expect(manageSkillsLink).toHaveAttribute('href', '/skills');
      expect(viewAnalyticsLink).toHaveAttribute('href', '/analytics');
    });
  });

  describe('Recent Exchanges', () => {
    it('should show "No recent exchanges" message when there are no exchanges', () => {
      render(<Dashboard />);

      expect(screen.getByText('No recent exchanges')).toBeInTheDocument();
      expect(
        screen.getByText('Start by creating your first exchange!')
      ).toBeInTheDocument();
    });

    it('should show "View All" link', () => {
      render(<Dashboard />);

      const viewAllLink = screen.getByText('View All').closest('a');
      expect(viewAllLink).toHaveAttribute('href', '/exchanges');
    });

    it('should display recent exchanges section header', () => {
      render(<Dashboard />);

      expect(screen.getByText('Recent Exchanges')).toBeInTheDocument();
    });
  });

  describe('Activity Feed', () => {
    it('should display activity feed section', () => {
      render(<Dashboard />);

      expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    });

    it('should show static activity items', () => {
      render(<Dashboard />);

      expect(screen.getByText('Exchange completed successfully')).toBeInTheDocument();
      expect(screen.getByText('New skill verification received')).toBeInTheDocument();
      expect(screen.getByText('Account created and verified')).toBeInTheDocument();
    });

    it('should show timestamps for activity items', () => {
      render(<Dashboard />);

      expect(screen.getByText('2 hours ago')).toBeInTheDocument();
      expect(screen.getByText('1 day ago')).toBeInTheDocument();
      expect(screen.getByText('3 days ago')).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should handle missing user data gracefully', () => {
      mockAppContext.state.user = null;

      render(<Dashboard />);

      expect(screen.getByText(/Welcome back, User!/)).toBeInTheDocument();
    });

    it('should handle missing timeBank user data', () => {
      mockTimeBankCore.user = null;

      render(<Dashboard />);

      expect(screen.getByText('0 hrs')).toBeInTheDocument();
      expect(screen.getByText('Welcome to TimeBank!')).toBeInTheDocument();
    });

    it('should handle stats loading errors gracefully', async () => {
      mockLoadStats.mockRejectedValueOnce(new Error('Failed to load stats'));

      render(<Dashboard />);

      await waitFor(() => {
        expect(mockLoadStats).toHaveBeenCalled();
      });

      // Component should still render
      expect(screen.getByText('Time Balance')).toBeInTheDocument();
    });
  });

  describe('Status Helpers', () => {
    it('should render Quick Stats section', () => {
      render(<Dashboard />);

      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    it('should display user balance with proper formatting', () => {
      mockTimeBankCore.user = {
        timeBalance: 100,
        totalHoursGiven: 50,
        totalHoursReceived: 50,
        reputationScore: 95,
      };

      render(<Dashboard />);

      expect(screen.getByText('100 hrs')).toBeInTheDocument();
    });
  });
});
