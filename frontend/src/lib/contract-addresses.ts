/**
 * Contract Addresses Registry
 * Centralised registry of deployed time-banking contract addresses per network
 */

import type { SupportedNetwork } from './stacks-network-client';

export interface ContractAddresses {
  timeBankCore: string;
  timeTokenFt: string;
  skillRegistry: string;
  exchangeManager: string;
  escrowManager: string;
  reputationSystem: string;
  rewardsDistributor: string;
  governance: string;
  insurancePool: string;
  disputeArbitration: string;
  skillCertificationNft: string;
  skillMatchingEngine: string;
  automationScheduler: string;
  multiSigWallet: string;
  referralProgram: string;
  emergencyControls: string;
  analyticsTracker: string;
}

const TESTNET_DEPLOYER = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const MAINNET_DEPLOYER = 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

function buildAddresses(deployer: string): ContractAddresses {
  return {
    timeBankCore: `${deployer}.time-bank-core`,
    timeTokenFt: `${deployer}.time-token-ft`,
    skillRegistry: `${deployer}.skill-registry`,
    exchangeManager: `${deployer}.exchange-manager`,
    escrowManager: `${deployer}.escrow-manager`,
    reputationSystem: `${deployer}.reputation-system`,
    rewardsDistributor: `${deployer}.rewards-distributor`,
    governance: `${deployer}.governance`,
    insurancePool: `${deployer}.insurance-pool`,
    disputeArbitration: `${deployer}.dispute-arbitration`,
    skillCertificationNft: `${deployer}.skill-certification-nft`,
    skillMatchingEngine: `${deployer}.skill-matching-engine`,
    automationScheduler: `${deployer}.automation-scheduler`,
    multiSigWallet: `${deployer}.multi-sig-wallet`,
    referralProgram: `${deployer}.referral-program`,
    emergencyControls: `${deployer}.emergency-controls`,
    analyticsTracker: `${deployer}.analytics-tracker`,
  };
}

const NETWORK_ADDRESSES: Record<SupportedNetwork, ContractAddresses> = {
  mainnet: buildAddresses(MAINNET_DEPLOYER),
  testnet: buildAddresses(TESTNET_DEPLOYER),
  devnet: buildAddresses(TESTNET_DEPLOYER),
  mocknet: buildAddresses(TESTNET_DEPLOYER),
};

export function getContractAddresses(network: SupportedNetwork): ContractAddresses {
  return NETWORK_ADDRESSES[network];
}

export function getContractAddress(
  network: SupportedNetwork,
  contract: keyof ContractAddresses
): string {
  return NETWORK_ADDRESSES[network][contract];
}

export function splitContractAddress(contractId: string): { address: string; name: string } {
  const parts = contractId.split('.');
  return { address: parts[0], name: parts[1] ?? '' };
}

export function getAllContractIds(network: SupportedNetwork): string[] {
  return Object.values(NETWORK_ADDRESSES[network]);
}
