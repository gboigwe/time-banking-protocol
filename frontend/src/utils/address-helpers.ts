// address-helpers.ts — Stacks address utility functions

/** Shorten a Stacks address for display */
export function shortenAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end + 3) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
