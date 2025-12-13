// Contract Configuration for Time Banking Protocol
// Deployed contracts on Stacks testnet with Clarity 4

import { StacksNetwork, StacksMainnet, StacksTestnet } from '@stacks/network';
import { ContractConfig, NetworkConfig } from '@/types/contracts';

// Network Configuration
export const getNetworkConfig = (): NetworkConfig => {
  const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';

  if (networkType === 'mainnet') {
    return {
      network: 'mainnet',
      apiUrl: 'https://api.hiro.so',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET || '',
    };
  }

  return {
    network: 'testnet',
    apiUrl: 'https://api.testnet.hiro.so',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SP3BXJENEWVNCFYGJF75DFS478H1BZJXNZPT84EAD',
  };
};

// Get Stacks Network Instance
export const getStacksNetwork = (): StacksNetwork => {
  const config = getNetworkConfig();

  if (config.network === 'mainnet') {
    return new StacksMainnet();
  }

  const testnet = new StacksTestnet();
  testnet.coreApiUrl = config.apiUrl;
  return testnet;
};

// Contract Names for all 7 Clarity 4 contracts
export const CONTRACT_NAMES: ContractConfig = {
  timeBankCore: process.env.NEXT_PUBLIC_TIME_BANK_CORE_CONTRACT || 'time-bank-core',
  skillRegistry: process.env.NEXT_PUBLIC_SKILL_REGISTRY_CONTRACT || 'skill-registry',
  exchangeManager: process.env.NEXT_PUBLIC_EXCHANGE_MANAGER_CONTRACT || 'exchange-manager',
  reputationSystem: process.env.NEXT_PUBLIC_REPUTATION_SYSTEM_CONTRACT || 'reputation-system',
  escrowManager: process.env.NEXT_PUBLIC_ESCROW_MANAGER_CONTRACT || 'escrow-manager',
  governance: process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT || 'governance',
  rewardsDistributor: process.env.NEXT_PUBLIC_REWARDS_DISTRIBUTOR_CONTRACT || 'rewards-distributor',
};

// Contract Addresses (deployed on testnet)
export const CONTRACT_ADDRESSES = {
  // Primary deployment address
  primary: 'SP3BXJENEWVNCFYGJF75DFS478H1BZJXNZPT84EAD',
  // Secondary deployment address (for some contracts)
  secondary: 'SPD5ETF2HZ921C8RJG2MHPAN7SSP9AYEYD5GSP84',
};

// Get contract address for specific contract
export const getContractAddress = (contractName: keyof ContractConfig): string => {
  const config = getNetworkConfig();

  // For testnet, we have two deployment addresses
  if (config.network === 'testnet') {
    // Contracts deployed at primary address
    const primaryContracts = ['timeBankCore', 'skillRegistry', 'rewardsDistributor'];

    if (primaryContracts.includes(contractName)) {
      return CONTRACT_ADDRESSES.primary;
    }

    // Contracts deployed at secondary address
    return CONTRACT_ADDRESSES.secondary;
  }

  // For mainnet, use single contract address
  return config.contractAddress;
};

// Get full contract identifier (address.contract-name)
export const getContractIdentifier = (contractName: keyof ContractConfig): string => {
  const address = getContractAddress(contractName);
  const name = CONTRACT_NAMES[contractName];
  return `${address}.${name}`;
};

// API Endpoints
export const API_ENDPOINTS = {
  account: (address: string) => `/extended/v1/address/${address}/balances`,
  transaction: (txId: string) => `/extended/v1/tx/${txId}`,
  contractCall: '/v2/contracts/call-read',
  broadcastTx: '/v2/transactions',
  contractInfo: (address: string, contractName: string) =>
    `/v2/contracts/interface/${address}/${contractName}`,
  contractSource: (address: string, contractName: string) =>
    `/v2/contracts/source/${address}/${contractName}`,
};

// Transaction Configuration
export const TX_CONFIG = {
  defaultFee: 200, // microSTX
  defaultPostConditionMode: 'allow' as const,
  defaultAnchorMode: 'any' as const,
  confirmationTimeout: 60000, // 60 seconds
  pollInterval: 3000, // 3 seconds
  maxRetries: 20,
};

// Contract Function Names
export const FUNCTION_NAMES = {
  // Time Bank Core
  timeBankCore: {
    registerUser: 'register-user',
    getUserInfo: 'get-user-info',
    getUserBalance: 'get-user-balance',
    transferCredits: 'transfer-credits',
    deactivateUser: 'deactivate-user',
    reactivateUser: 'reactivate-user',
    isUserActive: 'is-user-active',
    getProtocolStats: 'get-protocol-stats',
    mintCredits: 'mint-credits',
    burnCredits: 'burn-credits',
    toggleProtocolPause: 'toggle-protocol-pause',
  },

  // Skill Registry
  skillRegistry: {
    registerSkill: 'register-skill',
    verifySkill: 'verify-skill',
    approveSkillTemplate: 'approve-skill-template',
    awardBadge: 'award-badge',
    getSkillInfo: 'get-skill-info',
    getUserSkillCount: 'get-user-skill-count',
    isSkillVerified: 'is-skill-verified',
    getVerificationCount: 'get-verification-count',
    getRegistryStats: 'get-registry-stats',
  },

  // Exchange Manager
  exchangeManager: {
    createExchange: 'create-exchange',
    acceptExchange: 'accept-exchange',
    confirmCompletion: 'confirm-completion',
    cancelExchange: 'cancel-exchange',
    submitReview: 'submit-review',
    getExchangeDetails: 'get-exchange-details',
    isExchangeActive: 'is-exchange-active',
    isExchangeCompleted: 'is-exchange-completed',
    getExchangeStats: 'get-exchange-stats',
  },

  // Reputation System
  reputationSystem: {
    initializeReputation: 'initialize-reputation',
    updateReputation: 'update-reputation',
    endorseUser: 'endorse-user',
    applyDecay: 'apply-decay',
    updateCategoryReputation: 'update-category-reputation',
    awardBadge: 'award-badge',
    getUserReputation: 'get-user-reputation',
    getCategoryReputation: 'get-category-reputation',
    getEndorsementCount: 'get-endorsement-count',
    getReputationStats: 'get-reputation-stats',
  },

  // Escrow Manager
  escrowManager: {
    createEscrow: 'create-escrow',
    releaseEscrow: 'release-escrow',
    refundEscrow: 'refund-escrow',
    raiseDispute: 'raise-dispute',
    resolveDispute: 'resolve-dispute',
    getEscrowDetails: 'get-escrow-details',
    isEscrowActive: 'is-escrow-active',
    isEscrowExpired: 'is-escrow-expired',
    getEscrowStats: 'get-escrow-stats',
  },

  // Governance
  governance: {
    createProposal: 'create-proposal',
    castVote: 'cast-vote',
    finalizeProposal: 'finalize-proposal',
    executeProposal: 'execute-proposal',
    cancelProposal: 'cancel-proposal',
    setVotingPower: 'set-voting-power',
    getProposal: 'get-proposal',
    getVote: 'get-vote',
    getVotingPower: 'get-voting-power',
    canExecuteProposal: 'can-execute-proposal',
    getGovernanceStats: 'get-governance-stats',
    toggleGovernance: 'toggle-governance',
  },

  // Rewards Distributor
  rewardsDistributor: {
    startNewPeriod: 'start-new-period',
    registerActivity: 'register-activity',
    claimReward: 'claim-reward',
    finalizePeriod: 'finalize-period',
    contributeToPool: 'contribute-to-pool',
    getPeriodInfo: 'get-period-info',
    getUserReward: 'get-user-reward',
    getLifetimeRewards: 'get-lifetime-rewards',
    getPoolContribution: 'get-pool-contribution',
    isEligibleForRewards: 'is-eligible-for-rewards',
    getRewardsStats: 'get-rewards-stats',
    toggleRewardsSystem: 'toggle-rewards-system',
  },
};

// Error Messages
export const ERROR_MESSAGES: Record<number, string> = {
  // Time Bank Core
  1001: 'Unauthorized operation',
  1002: 'User not found',
  1003: 'User already exists',
  1004: 'Invalid parameters',
  1005: 'Protocol is paused',
  1006: 'User already registered',
  1007: 'User not registered',
  1008: 'Invalid amount',
  1009: 'Invalid recipient',
  1010: 'Insufficient credits',
  1011: 'Cannot transfer to yourself',
  1012: 'User is inactive',

  // Skill Registry
  2001: 'Unauthorized operation',
  2002: 'Skill not found',
  2003: 'Skill already exists',
  2004: 'Invalid parameters',
  2005: 'Skill not verified',
  2006: 'Insufficient reputation',
  2007: 'Cannot verify your own skill',

  // Escrow Manager
  3001: 'Unauthorized operation',
  3002: 'Escrow not found',
  3003: 'Invalid parameters',
  3009: 'Escrow has expired',
  3010: 'Insufficient credits',
  3011: 'Escrow already released',
  3012: 'Escrow already refunded',

  // Exchange Manager
  4001: 'Unauthorized operation',
  4002: 'Exchange not found',
  4003: 'Exchange already exists',
  4004: 'Invalid parameters',
  4005: 'Invalid exchange status',
  4006: 'Time conflict detected',
  4007: 'Already confirmed',
  4008: 'Already accepted',
  4009: 'Already completed',
  4010: 'Exchange not completed',

  // Reputation System
  5001: 'Unauthorized operation',
  5002: 'Reputation not found',
  5003: 'Invalid parameters',
  5006: 'Reputation already initialized',
  5007: 'Cannot endorse yourself',
  5008: 'Already endorsed this user',

  // Governance
  6001: 'Unauthorized operation',
  6002: 'Proposal not found',
  6003: 'Invalid parameters',
  6004: 'Already voted on this proposal',
  6005: 'Voting period has closed',
  6006: 'Proposal is still active',
  6007: 'Quorum not met',
  6008: 'Insufficient reputation to create proposal',
  6009: 'Timelock period still active',

  // Rewards Distributor
  7001: 'Unauthorized operation',
  7002: 'Period not found',
  7003: 'Invalid parameters',
  7004: 'Reward already claimed',
  7005: 'Reward period is still active',
  7006: 'Insufficient reward pool',
  7007: 'Not eligible for rewards',
};

// Get error message from error code
export const getErrorMessage = (errorCode: number): string => {
  return ERROR_MESSAGES[errorCode] || `Unknown error (code: ${errorCode})`;
};

// Constants from contracts
export const CONTRACT_CONSTANTS = {
  timeBankCore: {
    initialCredits: 10,
    maxTransferAmount: 1000,
  },
  skillRegistry: {
    minReputation: 50,
    categories: ['technical', 'creative', 'educational', 'practical', 'professional'],
  },
  exchangeManager: {
    minExchangeDuration: 3600, // 1 hour
    maxExchangeDuration: 86400, // 24 hours
  },
  reputationSystem: {
    decayPeriod: 2592000, // 30 days
  },
  escrow: {
    minEscrowDuration: 86400, // 1 day
  },
  governance: {
    votingPeriod: 604800, // 7 days
    timelockPeriod: 172800, // 2 days
    quorumPercentage: 10,
    minProposalReputation: 100,
  },
  rewards: {
    rewardPeriod: 2592000, // 30 days
    minActivityScore: 10,
    baseRewardAmount: 50,
    tierBronze: 100,
    tierSilver: 250,
    tierGold: 500,
    tierPlatinum: 1000,
  },
};
