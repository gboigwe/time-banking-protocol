import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { WalletProvider, useWallet } from './WalletContext';
import * as stacksLib from '@/lib/stacks';

// Mock the entire stacks lib
vi.mock('@/lib/stacks', () => ({
  userSession: {
    isUserSignedIn: vi.fn(),
    loadUserData: vi.fn(),
  },
  getUserAddress: vi.fn(),
  connectWallet: vi.fn(),
  disconnectWallet: vi.fn(),
  connectViaReown: vi.fn(),
  getNetwork: vi.fn(),
  getNetworkType: vi.fn(),
}));

// Mock error handling
vi.mock('@/lib/error-handling', () => ({
  ErrorParser: {
    parseError: (error: any) => ({
      message: error?.message || 'Unknown error',
      code: 'UNKNOWN_ERROR',
      category: 'general',
    }),
  },
}));

describe('useWallet Hook', () => {
  const mockAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const mockUserData = {
    profile: {
      stxAddress: {
        testnet: mockAddress,
      },
    },
  };
  const mockNetwork = { chainId: 2147483648 };
  const mockNetworkType = 'testnet';

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks - wallet not connected
    (stacksLib.userSession.isUserSignedIn as any).mockReturnValue(false);
    (stacksLib.getUserAddress as any).mockReturnValue(null);
    (stacksLib.userSession.loadUserData as any).mockReturnValue(null);
    (stacksLib.getNetwork as any).mockReturnValue(mockNetwork);
    (stacksLib.getNetworkType as any).mockReturnValue(mockNetworkType);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Hook Initialization', () => {
    it('should throw error when used outside of WalletProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useWallet());
      }).toThrow('useWallet must be used within a WalletProvider');

      console.error = originalError;
    });

    it('should initialize with disconnected state', async () => {
      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isConnected).toBe(false);
      expect(result.current.address).toBeUndefined();
      expect(result.current.userData).toBeUndefined();
    });

    it('should initialize with connected state if wallet is already connected', async () => {
      (stacksLib.userSession.isUserSignedIn as any).mockReturnValue(true);
      (stacksLib.getUserAddress as any).mockReturnValue(mockAddress);
      (stacksLib.userSession.loadUserData as any).mockReturnValue(mockUserData);

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isConnected).toBe(true);
      expect(result.current.address).toBe(mockAddress);
      expect(result.current.userData).toEqual(mockUserData);
      expect(result.current.network).toEqual(mockNetwork);
      expect(result.current.networkType).toBe(mockNetworkType);
    });
  });

  describe('connect()', () => {
    it('should set loading state when connecting', () => {
      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      act(() => {
        result.current.connect();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should call connectWallet from stacks lib', () => {
      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      act(() => {
        result.current.connect();
      });

      expect(stacksLib.connectWallet).toHaveBeenCalledWith({
        onFinish: expect.any(Function),
        onCancel: expect.any(Function),
      });
    });

    it('should update state when connection succeeds', async () => {
      let onFinishCallback: (() => void) | undefined;

      (stacksLib.connectWallet as any).mockImplementation(({ onFinish }: any) => {
        onFinishCallback = onFinish;
      });

      (stacksLib.userSession.isUserSignedIn as any).mockReturnValue(true);
      (stacksLib.getUserAddress as any).mockReturnValue(mockAddress);
      (stacksLib.userSession.loadUserData as any).mockReturnValue(mockUserData);

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.connect();
      });

      // Simulate successful connection
      act(() => {
        onFinishCallback?.();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
        expect(result.current.address).toBe(mockAddress);
        expect(result.current.userData).toEqual(mockUserData);
      });
    });

    it('should handle connection cancellation', async () => {
      let onCancelCallback: (() => void) | undefined;

      (stacksLib.connectWallet as any).mockImplementation(({ onCancel }: any) => {
        onCancelCallback = onCancel;
      });

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.connect();
      });

      expect(result.current.isLoading).toBe(true);

      // Simulate cancellation
      act(() => {
        onCancelCallback?.();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isConnected).toBe(false);
        expect(result.current.error).toBeUndefined();
      });
    });

    it('should handle connection errors', async () => {
      const errorMessage = 'Connection failed';
      (stacksLib.connectWallet as any).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.typedError).toBeDefined();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('connectWithReown()', () => {
    it('should call connectViaReown from stacks lib', () => {
      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      act(() => {
        result.current.connectWithReown();
      });

      expect(stacksLib.connectViaReown).toHaveBeenCalledWith({
        onFinish: expect.any(Function),
        onCancel: expect.any(Function),
      });
    });

    it('should update state when Reown connection succeeds', async () => {
      let onFinishCallback: (() => void) | undefined;

      (stacksLib.connectViaReown as any).mockImplementation(({ onFinish }: any) => {
        onFinishCallback = onFinish;
      });

      (stacksLib.userSession.isUserSignedIn as any).mockReturnValue(true);
      (stacksLib.getUserAddress as any).mockReturnValue(mockAddress);
      (stacksLib.userSession.loadUserData as any).mockReturnValue(mockUserData);

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.connectWithReown();
      });

      act(() => {
        onFinishCallback?.();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
        expect(result.current.address).toBe(mockAddress);
      });
    });

    it('should handle Reown connection errors', async () => {
      const errorMessage = 'Reown connection failed';
      (stacksLib.connectViaReown as any).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.connectWithReown();
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('disconnect()', () => {
    it('should call disconnectWallet from stacks lib', async () => {
      (stacksLib.disconnectWallet as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.disconnect();
      });

      expect(stacksLib.disconnectWallet).toHaveBeenCalled();
    });

    it('should clear wallet state when disconnecting', async () => {
      // Start with connected state
      (stacksLib.userSession.isUserSignedIn as any).mockReturnValue(true);
      (stacksLib.getUserAddress as any).mockReturnValue(mockAddress);
      (stacksLib.userSession.loadUserData as any).mockReturnValue(mockUserData);
      (stacksLib.disconnectWallet as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      await act(async () => {
        await result.current.disconnect();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
        expect(result.current.address).toBeUndefined();
        expect(result.current.userData).toBeUndefined();
        expect(result.current.error).toBeUndefined();
      });
    });

    it('should handle disconnect errors', async () => {
      const errorMessage = 'Disconnect failed';
      (stacksLib.disconnectWallet as any).mockRejectedValue(new Error(errorMessage));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.disconnect();
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('refreshConnection()', () => {
    it('should refresh connection state', async () => {
      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Change the mock to simulate wallet being connected
      (stacksLib.userSession.isUserSignedIn as any).mockReturnValue(true);
      (stacksLib.getUserAddress as any).mockReturnValue(mockAddress);
      (stacksLib.userSession.loadUserData as any).mockReturnValue(mockUserData);

      act(() => {
        result.current.refreshConnection();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
        expect(result.current.address).toBe(mockAddress);
      });
    });

    it('should handle refresh errors gracefully', async () => {
      const errorMessage = 'Refresh failed';
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Simulate error during refresh
      (stacksLib.userSession.isUserSignedIn as any).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      act(() => {
        result.current.refreshConnection();
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isConnected).toBe(false);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Network Information', () => {
    it('should provide network and networkType', async () => {
      const { result } = renderHook(() => useWallet(), {
        wrapper: WalletProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.network).toEqual(mockNetwork);
      expect(result.current.networkType).toBe(mockNetworkType);
    });
  });
});
