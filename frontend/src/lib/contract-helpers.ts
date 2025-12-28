/**
 * Contract Call Helpers for Stacks.js v8+
 * Utilities for Clarity value conversions and contract interactions
 */

import {
  ClarityValue,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  intCV,
  bufferCV,
  trueCV,
  falseCV,
  noneCV,
  someCV,
  standardPrincipalCV,
  contractPrincipalCV,
  listCV,
  tupleCV,
  cvToValue,
  cvToString,
  cvToJSON,
} from '@stacks/transactions';

/**
 * Clarity Value Builders
 * Simplified constructors for common Clarity values
 */
export const CV = {
  /**
   * Create string-ascii Clarity value
   */
  ascii: (value: string): ClarityValue => stringAsciiCV(value),

  /**
   * Create string-utf8 Clarity value
   */
  utf8: (value: string): ClarityValue => stringUtf8CV(value),

  /**
   * Create uint Clarity value
   */
  uint: (value: number | bigint): ClarityValue =>
    uintCV(typeof value === 'number' ? BigInt(value) : value),

  /**
   * Create int Clarity value
   */
  int: (value: number | bigint): ClarityValue =>
    intCV(typeof value === 'number' ? BigInt(value) : value),

  /**
   * Create buffer Clarity value
   */
  buffer: (value: Uint8Array | string): ClarityValue => {
    if (typeof value === 'string') {
      return bufferCV(Buffer.from(value, 'hex'));
    }
    return bufferCV(value);
  },

  /**
   * Create boolean Clarity value
   */
  bool: (value: boolean): ClarityValue => (value ? trueCV() : falseCV()),

  /**
   * Create none Clarity value
   */
  none: (): ClarityValue => noneCV(),

  /**
   * Create some Clarity value
   */
  some: (value: ClarityValue): ClarityValue => someCV(value),

  /**
   * Create standard principal Clarity value
   */
  principal: (address: string): ClarityValue => standardPrincipalCV(address),

  /**
   * Create contract principal Clarity value
   */
  contract: (address: string, name: string): ClarityValue =>
    contractPrincipalCV(address, name),

  /**
   * Create list Clarity value
   */
  list: (values: ClarityValue[]): ClarityValue => listCV(values),

  /**
   * Create tuple Clarity value
   */
  tuple: (data: Record<string, ClarityValue>): ClarityValue => tupleCV(data),
};

/**
 * Clarity Value Parsers
 * Extract JavaScript values from Clarity values
 */
export const ParseCV = {
  /**
   * Parse to JavaScript value
   */
  toValue: (cv: ClarityValue): any => cvToValue(cv),

  /**
   * Parse to string representation
   */
  toString: (cv: ClarityValue): string => cvToString(cv),

  /**
   * Parse to JSON
   */
  toJSON: (cv: ClarityValue): any => cvToJSON(cv),

  /**
   * Parse uint to number
   */
  toNumber: (cv: ClarityValue): number => {
    const value = cvToValue(cv);
    return typeof value === 'bigint' ? Number(value) : value;
  },

  /**
   * Parse uint to bigint
   */
  toBigInt: (cv: ClarityValue): bigint => {
    const value = cvToValue(cv);
    return typeof value === 'bigint' ? value : BigInt(value);
  },

  /**
   * Parse boolean
   */
  toBool: (cv: ClarityValue): boolean => {
    return cvToValue(cv) === true;
  },

  /**
   * Parse optional value
   */
  toOptional: <T>(cv: ClarityValue, parser?: (val: any) => T): T | null => {
    const value = cvToValue(cv);
    if (value === null || value === undefined) return null;
    return parser ? parser(value) : value;
  },

  /**
   * Parse list
   */
  toList: <T>(cv: ClarityValue, parser?: (val: any) => T): T[] => {
    const value = cvToValue(cv);
    if (!Array.isArray(value)) return [];
    return parser ? value.map(parser) : value;
  },

  /**
   * Parse tuple
   */
  toTuple: (cv: ClarityValue): Record<string, any> => {
    const value = cvToValue(cv);
    return typeof value === 'object' && value !== null ? value : {};
  },
};

/**
 * Contract Call Argument Helpers
 */
export const ContractArgs = {
  /**
   * Create args for transfer function
   */
  transfer: (amount: number | bigint, recipient: string): ClarityValue[] => [
    CV.uint(amount),
    CV.principal(recipient),
  ],

  /**
   * Create args for mint function
   */
  mint: (amount: number | bigint, recipient: string): ClarityValue[] => [
    CV.uint(amount),
    CV.principal(recipient),
  ],

  /**
   * Create args for burn function
   */
  burn: (amount: number | bigint): ClarityValue[] => [CV.uint(amount)],

  /**
   * Create args for set-approved function
   */
  setApproved: (
    spender: string,
    amount: number | bigint,
    approved: boolean
  ): ClarityValue[] => [CV.principal(spender), CV.uint(amount), CV.bool(approved)],
};

/**
 * Common Clarity Type Guards
 */
export const ClarityTypeGuards = {
  isUint: (cv: ClarityValue): boolean => cv.type === 1,
  isInt: (cv: ClarityValue): boolean => cv.type === 0,
  isBuffer: (cv: ClarityValue): boolean => cv.type === 2,
  isBool: (cv: ClarityValue): boolean =>
    cv.type === 3 || cv.type === 4,
  isPrincipal: (cv: ClarityValue): boolean =>
    cv.type === 5 || cv.type === 6,
  isOptional: (cv: ClarityValue): boolean =>
    cv.type === 9 || cv.type === 10,
  isList: (cv: ClarityValue): boolean => cv.type === 11,
  isTuple: (cv: ClarityValue): boolean => cv.type === 12,
  isStringAscii: (cv: ClarityValue): boolean => cv.type === 13,
  isStringUtf8: (cv: ClarityValue): boolean => cv.type === 14,
};

/**
 * Utility functions for common conversions
 */
export const ContractUtils = {
  /**
   * Convert STX to microSTX
   */
  stxToMicro: (stx: number): bigint => {
    return BigInt(Math.floor(stx * 1_000_000));
  },

  /**
   * Convert microSTX to STX
   */
  microToStx: (micro: bigint | number): number => {
    const amount = typeof micro === 'bigint' ? Number(micro) : micro;
    return amount / 1_000_000;
  },

  /**
   * Format address for display
   */
  formatAddress: (address: string, chars = 4): string => {
    if (address.length <= chars * 2) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  },

  /**
   * Validate principal address
   */
  isValidPrincipal: (address: string): boolean => {
    return /^(SP|SM)[0-9A-Z]{38,41}(\.[a-z][a-z0-9-]*)?$/i.test(address);
  },

  /**
   * Parse contract identifier
   */
  parseContractId: (
    contractId: string
  ): { address: string; name: string } | null => {
    const parts = contractId.split('.');
    if (parts.length !== 2) return null;
    return { address: parts[0], name: parts[1] };
  },

  /**
   * Build contract identifier
   */
  buildContractId: (address: string, name: string): string => {
    return `${address}.${name}`;
  },
};

/**
 * Response parsers for common contract responses
 */
export const ResponseParsers = {
  /**
   * Parse ok response
   */
  parseOk: <T>(response: any, parser?: (val: any) => T): T | null => {
    if (!response || response.type !== 'ok') return null;
    const value = cvToValue(response.value);
    return parser ? parser(value) : value;
  },

  /**
   * Parse err response
   */
  parseErr: (response: any): any => {
    if (!response || response.type !== 'err') return null;
    return cvToValue(response.value);
  },

  /**
   * Check if response is ok
   */
  isOk: (response: any): boolean => {
    return response && response.type === 'ok';
  },

  /**
   * Check if response is err
   */
  isErr: (response: any): boolean => {
    return response && response.type === 'err';
  },
};
