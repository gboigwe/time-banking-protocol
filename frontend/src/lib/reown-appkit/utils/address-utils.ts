/**
 * Address Utility Functions for Stacks Blockchain
 */

import { c32address, c32addressDecode } from 'c32check';

/**
 * Validates a Stacks address
 */
export function validateStacksAddress(address: string): boolean {
  try {
    c32addressDecode(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats a Stacks address for display
 */
export function formatStacksAddress(address: string, chars: number = 6): string {
  if (!validateStacksAddress(address)) {
    return address;
  }

  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Compares two Stacks addresses for equality
 */
export function compareStacksAddresses(address1: string, address2: string): boolean {
  return address1.toLowerCase() === address2.toLowerCase();
}

/**
 * Checks if address is a contract address
 */
export function isContractAddress(address: string): boolean {
  return address.includes('.');
}

/**
 * Extracts contract principal from contract address
 */
export function getContractPrincipal(contractAddress: string): {
  address: string;
  contractName: string;
} | null {
  if (!isContractAddress(contractAddress)) {
    return null;
  }

  const [address, contractName] = contractAddress.split('.');
  return { address, contractName };
}

/**
 * Determines network from address prefix
 */
export function getNetworkFromAddress(address: string): 'mainnet' | 'testnet' | null {
  if (address.startsWith('SP')) {
    return 'mainnet';
  }
  if (address.startsWith('ST')) {
    return 'testnet';
  }
  return null;
}

export default {
  validateStacksAddress,
  formatStacksAddress,
  compareStacksAddresses,
  isContractAddress,
  getContractPrincipal,
  getNetworkFromAddress,
};
