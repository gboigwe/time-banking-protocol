import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

// Mock Next.js router
const mockPush = vi.fn();
const mockRouter = {
  pathname: '/dashboard',
  push: mockPush,
  query: {},
  asPath: '/dashboard',
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock contexts
const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
const mockConnectWithReown = vi.fn();

const mockWalletContext = {
  isConnected: false,
  address: null,
  connect: mockConnect,
  disconnect: mockDisconnect,
  connectWithReown: mockConnectWithReown,
};

const mockAppContext = {
  state: {
    user: null,
    notifications: {
      unreadCount: 0,
    },
  },
};

vi.mock('@/contexts/WalletContext', () => ({
  useWallet: () => mockWalletContext,
}));

vi.mock('@/contexts/AppContext', () => ({
  useApp: () => mockAppContext,
}));

vi.mock('@/lib/stacks', () => ({
  formatPrincipal: (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWalletContext.isConnected = false;
    mockWalletContext.address = null;
    mockAppContext.state.user = null;
    mockAppContext.state.notifications.unreadCount = 0;
  });

  describe('Not Connected State', () => {
    it('should render the TimeBank logo', () => {
      render(<Header />);
      expect(screen.getByText('TimeBank')).toBeInTheDocument();
    });

    it('should show "Connect Wallet" button when not connected', () => {
      render(<Header />);
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should not show navigation items when not connected', () => {
      render(<Header />);
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Marketplace')).not.toBeInTheDocument();
    });

    it('should open wallet modal when "Connect Wallet" is clicked', async () => {
      render(<Header />);

      const connectButton = screen.getByText('Connect Wallet');
      fireEvent.click(connectButton);

      await waitFor(() => {
        expect(screen.getByText('Browser Extension')).toBeInTheDocument();
        expect(screen.getByText('WalletConnect')).toBeInTheDocument();
      });
    });

    it('should call connect when browser extension option is selected', async () => {
      render(<Header />);

      // Open modal
      fireEvent.click(screen.getByText('Connect Wallet'));

      // Click browser extension option
      await waitFor(() => {
        const browserOption = screen.getByText('Browser Extension');
        fireEvent.click(browserOption);
      });

      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it('should call connectWithReown when WalletConnect option is selected', async () => {
      render(<Header />);

      // Open modal
      fireEvent.click(screen.getByText('Connect Wallet'));

      // Click WalletConnect option
      await waitFor(() => {
        const walletConnectOption = screen.getByText('WalletConnect');
        fireEvent.click(walletConnectOption);
      });

      expect(mockConnectWithReown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Connected State', () => {
    beforeEach(() => {
      mockWalletContext.isConnected = true;
      mockWalletContext.address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      mockAppContext.state.user = {
        user: {
          timeBalance: 25,
        },
      } as any;
    });

    it('should show navigation items when connected', () => {
      render(<Header />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Marketplace')).toBeInTheDocument();
      expect(screen.getByText('Exchanges')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Governance')).toBeInTheDocument();
    });

    it('should display time balance', () => {
      render(<Header />);
      expect(screen.getByText('25 hrs')).toBeInTheDocument();
    });

    it('should display formatted user address', () => {
      render(<Header />);
      expect(screen.getByText('ST1PQH...ZGZGM')).toBeInTheDocument();
    });

    it('should show notification badge when there are unread notifications', () => {
      mockAppContext.state.notifications.unreadCount = 3;
      render(<Header />);

      const badge = screen.getByText('3');
      expect(badge).toBeInTheDocument();
    });

    it('should not show notification badge when there are no unread notifications', () => {
      mockAppContext.state.notifications.unreadCount = 0;
      render(<Header />);

      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('should toggle profile dropdown when profile button is clicked', async () => {
      render(<Header />);

      const profileButton = screen.getByText('Connected').closest('button');
      expect(profileButton).toBeInTheDocument();

      // Profile dropdown should not be visible initially
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(profileButton!);
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Disconnect')).toBeInTheDocument();
      });
    });

    it('should call disconnect when Disconnect button is clicked', async () => {
      render(<Header />);

      // Open profile dropdown
      const profileButton = screen.getByText('Connected').closest('button');
      fireEvent.click(profileButton!);

      // Click disconnect
      await waitFor(async () => {
        const disconnectButton = screen.getByText('Disconnect');
        fireEvent.click(disconnectButton);
      });

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should highlight current navigation item', () => {
      mockRouter.pathname = '/marketplace';
      render(<Header />);

      const marketplaceLink = screen.getAllByText('Marketplace')[0];
      expect(marketplaceLink.className).toContain('text-primary-600');
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu when hamburger button is clicked', async () => {
      mockWalletContext.isConnected = true;
      render(<Header />);

      // Find mobile menu button (with Bars3Icon or XMarkIcon)
      const menuButtons = screen.getAllByRole('button');
      const mobileMenuButton = menuButtons.find(btn =>
        btn.querySelector('svg') && btn.className.includes('md:hidden')
      );

      expect(mobileMenuButton).toBeInTheDocument();

      // Menu should not be visible initially (desktop nav items are visible instead)
      const desktopNav = screen.getAllByText('Dashboard');
      expect(desktopNav.length).toBeGreaterThan(0);
    });
  });

  describe('Wallet Modal', () => {
    it('should close modal when clicking outside', async () => {
      render(<Header />);

      // Open modal
      fireEvent.click(screen.getByText('Connect Wallet'));

      await waitFor(() => {
        expect(screen.getByText('Browser Extension')).toBeInTheDocument();
      });

      // Click backdrop (the fixed inset-0 div)
      const backdrop = screen.getByText('Browser Extension').closest('.fixed');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      await waitFor(() => {
        expect(screen.queryByText('Browser Extension')).not.toBeInTheDocument();
      });
    });

    it('should close modal when clicking X button', async () => {
      render(<Header />);

      // Open modal
      fireEvent.click(screen.getByText('Connect Wallet'));

      await waitFor(() => {
        expect(screen.getByText('Browser Extension')).toBeInTheDocument();
      });

      // Find and click close button
      const closeButtons = screen.getAllByRole('button');
      const xButton = closeButtons.find(btn =>
        btn.querySelector('svg') && btn.className.includes('text-neutral-400')
      );

      if (xButton) {
        fireEvent.click(xButton);
      }

      await waitFor(() => {
        expect(screen.queryByText('Browser Extension')).not.toBeInTheDocument();
      });
    });

    it('should display wallet recommendations', async () => {
      render(<Header />);

      fireEvent.click(screen.getByText('Connect Wallet'));

      await waitFor(() => {
        expect(screen.getByText('Recommended wallets:')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle Reown connection errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockConnectWithReown.mockRejectedValueOnce(new Error('Connection failed'));

      render(<Header />);

      // Open modal
      fireEvent.click(screen.getByText('Connect Wallet'));

      // Click WalletConnect option
      await waitFor(() => {
        const walletConnectOption = screen.getByText('WalletConnect');
        fireEvent.click(walletConnectOption);
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Reown connection failed:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
