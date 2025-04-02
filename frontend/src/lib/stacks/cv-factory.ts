// cv-factory.ts — ClarityValue factory functions for Stacks.js integration

/** ClarityValue base type */
export interface ClarityValue {
  type: string;
}

/** UInt ClarityValue */
export interface UIntCV extends ClarityValue {
  type: 'uint';
  value: bigint;
}

/**
 * Create a uint ClarityValue
 * @param value - the uint value
 * @returns UIntCV
 */
export function uintCV(value: number | bigint): UIntCV {
  return { type: 'uint', value: BigInt(value) };
}

/** Int ClarityValue */
export interface IntCV extends ClarityValue {
  type: 'int';
  value: bigint;
}

/**
 * Create an int ClarityValue
 * @param value - the int value
 * @returns IntCV
 */
export function intCV(value: number | bigint): IntCV {
  return { type: 'int', value: BigInt(value) };
}

/** Bool ClarityValue */
export interface BoolCV extends ClarityValue {
  type: 'true' | 'false';
}

/** Create a true ClarityValue */
export function trueCV(): BoolCV {
  return { type: 'true' };
}
