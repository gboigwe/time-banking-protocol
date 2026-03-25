/**
 * Stacks Utility Functions
 * Common helpers for Stacks blockchain data formatting and manipulation
 */

import { cvToValue, hexToCV, serializeCV, deserializeCV, ClarityValue } from '@stacks/transactions';

// ─── Address utilities ────────────────────────────────────────────────────────

/**
 * Truncates a Stacks address for display: "SP1AB...XY9Z"
 */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Splits a contract principal into address and name
 */
export function splitContractId(contractId: string): { address: string; name: string } {
  const dotIndex = contractId.lastIndexOf('.');
  if (dotIndex === -1) return { address: contractId, name: '' };
  return { address: contractId.slice(0, dotIndex), name: contractId.slice(dotIndex + 1) };
}

/**
 * Formats a contract principal for display
 */
export function formatContractId(address: string, name: string): string {
  return `${address}.${name}`;
}

// ─── STX / micro-STX utilities ────────────────────────────────────────────────

const MICRO_STX = BigInt(1_000_000);

/**
 * Converts micro-STX to STX as a decimal string
 */
export function microStxToStx(microStx: bigint): string {
  const whole = microStx / MICRO_STX;
  const fraction = microStx % MICRO_STX;
  if (fraction === BigInt(0)) return whole.toString();
  return `${whole}.${fraction.toString().padStart(6, '0').replace(/0+$/, '')}`;
}

/**
 * Converts STX string amount to micro-STX bigint
 */
export function stxToMicroStx(stx: string | number): bigint {
  const [whole, fraction = ''] = String(stx).split('.');
  const wholeUint = BigInt(whole) * MICRO_STX;
  const fractionPadded = fraction.slice(0, 6).padEnd(6, '0');
  return wholeUint + BigInt(fractionPadded);
}

/**
 * Formats micro-STX for display with 2 decimal places
 */
export function formatStx(microStx: bigint, decimals = 2): string {
  const stx = Number(microStx) / 1_000_000;
  return stx.toFixed(decimals);
}

// ─── Block time utilities ─────────────────────────────────────────────────────

/**
 * Converts a Unix block timestamp (seconds) to a JS Date
 */
export function blockTimeToDate(blockTime: number): Date {
  return new Date(blockTime * 1000);
}

/**
 * Returns a human-readable relative time string
 */
export function relativeBlockTime(blockTime: number): string {
  const diffMs = Date.now() - blockTime * 1000;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

/**
 * Checks if a block-time based expiry has passed
 */
export function isExpired(expiresAt: number): boolean {
  return Math.floor(Date.now() / 1000) >= expiresAt;
}

/**
 * Returns seconds remaining until a block-time expiry (0 if past)
 */
export function secondsUntilExpiry(expiresAt: number): number {
  return Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
}

// ─── Clarity value utilities ──────────────────────────────────────────────────

/**
 * Safely decodes a Clarity hex value, returning null on error
 */
export function safeHexToValue(hex: string): unknown {
  try {
    const cv = hexToCV(hex);
    return cvToValue(cv, true);
  } catch {
    return null;
  }
}

/**
 * Serialises a Clarity value to hex string
 */
export function clarityValueToHex(cv: ClarityValue): string {
  return Buffer.from(serializeCV(cv)).toString('hex');
}

// ─── Time credit utilities ────────────────────────────────────────────────────

/**
 * Formats time credits as hours/minutes string
 */
export function formatTimeCredits(credits: bigint): string {
  if (credits < BigInt(1)) return '0h';
  return `${credits}h`;
}

/**
 * Parses a duration in seconds to a human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
