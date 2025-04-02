// address-helpers.ts — Stacks address utility functions

/** Shorten a Stacks address for display */
export function shortenAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end + 3) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/** Check if a string is a valid Stacks address */
export function isValidStacksAddress(address: string): boolean {
  return /^S[MT][0-9A-Z]{38,39}$/.test(address);
}

/** Check if address is on testnet */
export function isTestnetAddress(address: string): boolean {
  return address.startsWith('ST');
}

/** Check if address is on mainnet */
export function isMainnetAddress(address: string): boolean {
  return address.startsWith('SM') || address.startsWith('SP');
}

/** Parse contract ID into address and name */
export function parseContractId(contractId: string): { address: string; name: string } | null {
  const parts = contractId.split('.');
  if (parts.length !== 2) return null;
  return { address: parts[0], name: parts[1] };
}

/** Convert address to buffer representation */
export function addressToBuffer(address: string): Uint8Array {
  return new TextEncoder().encode(address);
}
