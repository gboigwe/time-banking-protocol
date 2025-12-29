/**
 * Test Constants
 * Shared constants for testing
 */

export const TEST_ADDRESSES = {
  requester: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  provider: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  admin: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  user1: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
  user2: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
} as const;

export const TEST_CONTRACT_IDS = {
  timeBank: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.time-banking',
  timeBankCore: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.time-banking-core',
  timeBankGovernance: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.time-banking-governance',
  skillVerification: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.skill-verification',
} as const;

export const TEST_TRANSACTION_HASHES = {
  success: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  pending: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  failed: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
} as const;

export const TEST_BLOCK_HASHES = {
  block100: '0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1',
  block101: '0xdef456abc123def456abc123def456abc123def456abc123def456abc123def4',
  block102: '0x123abc456def123abc456def123abc456def123abc456def123abc456def123a',
} as const;

export const TEST_SKILLS = {
  webDevelopment: 'web-development',
  graphicDesign: 'graphic-design',
  writing: 'writing',
  marketing: 'marketing',
  tutoring: 'tutoring',
  cooking: 'cooking',
} as const;

export const TEST_USER_DATA = {
  basic: {
    displayName: 'Test User',
    email: 'test@example.com',
    timeBalance: 10,
    totalHoursGiven: 5,
    totalHoursReceived: 15,
    reputationScore: 85,
    joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  },
  newUser: {
    displayName: 'New User',
    email: 'new@example.com',
    timeBalance: 0,
    totalHoursGiven: 0,
    totalHoursReceived: 0,
    reputationScore: 0,
    joinedAt: Date.now(),
  },
  experiencedUser: {
    displayName: 'Experienced User',
    email: 'experienced@example.com',
    timeBalance: 100,
    totalHoursGiven: 50,
    totalHoursReceived: 150,
    reputationScore: 95,
    joinedAt: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
  },
} as const;

export const TEST_EXCHANGE_DATA = {
  pending: {
    id: 1,
    requester: TEST_ADDRESSES.requester,
    provider: null,
    serviceOffered: TEST_SKILLS.webDevelopment,
    serviceWanted: TEST_SKILLS.graphicDesign,
    hoursOffered: 5,
    status: 'pending' as const,
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  },
  active: {
    id: 2,
    requester: TEST_ADDRESSES.requester,
    provider: TEST_ADDRESSES.provider,
    serviceOffered: TEST_SKILLS.writing,
    serviceWanted: TEST_SKILLS.tutoring,
    hoursOffered: 3,
    status: 'active' as const,
    createdAt: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    acceptedAt: Date.now() - 20 * 60 * 60 * 1000, // 20 hours ago
  },
  completed: {
    id: 3,
    requester: TEST_ADDRESSES.user1,
    provider: TEST_ADDRESSES.user2,
    serviceOffered: TEST_SKILLS.marketing,
    serviceWanted: TEST_SKILLS.cooking,
    hoursOffered: 2,
    status: 'completed' as const,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    acceptedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  cancelled: {
    id: 4,
    requester: TEST_ADDRESSES.requester,
    provider: null,
    serviceOffered: TEST_SKILLS.graphicDesign,
    serviceWanted: TEST_SKILLS.webDevelopment,
    hoursOffered: 4,
    status: 'cancelled' as const,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    cancelledAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
} as const;

export const TEST_EVENTS = {
  exchangeCreated: {
    type: 'print_event' as const,
    topic: 'exchange-created',
    data: {
      'exchange-id': 1,
      requester: TEST_ADDRESSES.requester,
      'service-offered': TEST_SKILLS.webDevelopment,
      'service-wanted': TEST_SKILLS.graphicDesign,
      'hours-offered': 5,
    },
  },
  exchangeAccepted: {
    type: 'print_event' as const,
    topic: 'exchange-accepted',
    data: {
      'exchange-id': 1,
      provider: TEST_ADDRESSES.provider,
    },
  },
  exchangeCompleted: {
    type: 'print_event' as const,
    topic: 'exchange-completed',
    data: {
      'exchange-id': 1,
      'completed-by': TEST_ADDRESSES.requester,
    },
  },
  skillVerified: {
    type: 'print_event' as const,
    topic: 'skill-verified',
    data: {
      user: TEST_ADDRESSES.requester,
      skill: TEST_SKILLS.webDevelopment,
      verifier: TEST_ADDRESSES.provider,
    },
  },
} as const;

export const TEST_NETWORK_CONFIG = {
  testnet: {
    chainId: 2147483648,
    name: 'testnet',
    url: 'https://stacks-node-api.testnet.stacks.co',
  },
  mainnet: {
    chainId: 1,
    name: 'mainnet',
    url: 'https://stacks-node-api.mainnet.stacks.co',
  },
  mocknet: {
    chainId: 2147483647,
    name: 'mocknet',
    url: 'http://localhost:3999',
  },
} as const;

export const TEST_ERROR_MESSAGES = {
  walletNotConnected: 'Wallet not connected',
  insufficientBalance: 'Insufficient time balance',
  invalidExchange: 'Invalid exchange',
  unauthorized: 'Unauthorized',
  networkError: 'Network error',
  transactionFailed: 'Transaction failed',
  contractCallFailed: 'Contract call failed',
} as const;

export const TEST_TIMEOUTS = {
  short: 1000,
  medium: 5000,
  long: 10000,
  veryLong: 30000,
} as const;

export const TEST_DELAYS = {
  debounce: 300,
  animation: 500,
  apiCall: 1000,
} as const;

export const TEST_PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
  minPageSize: 5,
} as const;
