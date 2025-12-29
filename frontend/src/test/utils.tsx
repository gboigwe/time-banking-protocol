import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

/**
 * Mock Stacks wallet connection
 */
export const mockWalletConnection = {
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  publicKey: '0x03ef788b3830c00abe8f64f62dc32fc863bc0b2cafeb073b6c8e1c7657d9c2c3ab',
  network: 'testnet' as const,
  isConnected: true,
};

/**
 * Mock Stacks authentication
 */
export const mockStacksAuth = {
  userSession: {
    isUserSignedIn: vi.fn(() => true),
    loadUserData: vi.fn(() => ({
      profile: {
        stxAddress: {
          testnet: mockWalletConnection.address,
        },
      },
    })),
  },
  authenticate: vi.fn(),
  signOut: vi.fn(),
};

/**
 * Mock chainhook event
 */
export function createMockChainhookEvent(overrides = {}) {
  return {
    txHash: '0x1234567890abcdef',
    blockHeight: 100,
    blockHash: '0xabcdef1234567890',
    contractId: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.time-banking',
    eventType: 'print_event',
    eventTopic: 'exchange-created',
    value: {
      'exchange-id': 1,
      requester: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      'service-offered': 'web-development',
      'service-wanted': 'graphic-design',
      'hours-offered': 5,
    },
    affectedAddresses: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'],
    success: true,
    timestamp: Date.now(),
    metadata: {},
    ...overrides,
  };
}

/**
 * Mock contract call response
 */
export function createMockContractCallResponse(value: any) {
  return {
    okay: true,
    result: value,
  };
}

/**
 * Mock transaction broadcast response
 */
export function createMockTxBroadcastResponse(txId = '0xabcdef123456') {
  return {
    txid: txId,
  };
}

/**
 * Wait for async updates
 */
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Mock WebSocket client
 */
export const createMockSocketClient = () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  subscribeToContract: vi.fn(),
  subscribeToUser: vi.fn(),
  subscribeToEventType: vi.fn(),
  unsubscribe: vi.fn(),
  onEvent: vi.fn(),
  onStatusChange: vi.fn(),
  onError: vi.fn(),
  getStatus: vi.fn(() => 'connected'),
});

/**
 * Mock optimistic state manager
 */
export const createMockOptimisticStateManager = () => ({
  applyUpdate: vi.fn((type, data, txId) => ({
    id: 'opt-123',
    type,
    data,
    status: 'pending',
    timestamp: Date.now(),
    expiresAt: Date.now() + 30000,
    relatedTxId: txId,
  })),
  confirmUpdate: vi.fn(() => true),
  revertUpdate: vi.fn(() => true),
  getUpdate: vi.fn(),
  getPendingUpdates: vi.fn(() => []),
  executeWithOptimistic: vi.fn(async (type, data, operation) => {
    try {
      const result = await operation();
      return { success: true, result };
    } catch (error) {
      return { success: false, error };
    }
  }),
});
