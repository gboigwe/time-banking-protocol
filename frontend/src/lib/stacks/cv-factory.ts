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

/** Create a false ClarityValue */
export function falseCV(): BoolCV {
  return { type: 'false' };
}

/** Create a bool ClarityValue from a JS boolean */
export function boolCV(value: boolean): BoolCV {
  return value ? trueCV() : falseCV();
}

/** StringAscii ClarityValue */
export interface StringAsciiCV extends ClarityValue {
  type: 'string-ascii';
  value: string;
}

/**
 * Create a string-ascii ClarityValue
 * @param value - ASCII string content
 * @returns StringAsciiCV
 */
export function stringAsciiCV(value: string): StringAsciiCV {
  return { type: 'string-ascii', value };
}

/** StringUtf8 ClarityValue */
export interface StringUtf8CV extends ClarityValue {
  type: 'string-utf8';
  value: string;
}

/**
 * Create a string-utf8 ClarityValue
 * @param value - UTF-8 string content
 * @returns StringUtf8CV
 */
export function stringUtf8CV(value: string): StringUtf8CV {
  return { type: 'string-utf8', value };
}

/** Buffer ClarityValue */
export interface BufferCV extends ClarityValue {
  type: 'buffer';
  value: Uint8Array;
}

/**
 * Create a buffer ClarityValue from Uint8Array
 * @param value - the buffer data
 */
export function bufferCV(value: Uint8Array): BufferCV {
  return { type: 'buffer', value };
}

/**
 * Create a buffer ClarityValue from a string
 * @param value - string to encode as UTF-8 buffer
 */
export function bufferCVFromString(value: string): BufferCV {
  return bufferCV(new TextEncoder().encode(value));
}

/** None ClarityValue (Clarity optional) */
export interface NoneCV extends ClarityValue {
  type: 'none';
}

/** Create a none ClarityValue */
export function noneCV(): NoneCV {
  return { type: 'none' };
}

/** Some ClarityValue (Clarity optional with value) */
export interface SomeCV extends ClarityValue {
  type: 'some';
  value: ClarityValue;
}

/**
 * Create a some ClarityValue wrapping another value
 * @param value - the inner ClarityValue
 */
export function someCV(value: ClarityValue): SomeCV {
  return { type: 'some', value };
}

/** Ok response ClarityValue */
export interface OkCV extends ClarityValue {
  type: 'ok';
  value: ClarityValue;
}

/**
 * Create an ok response ClarityValue
 * @param value - the success value
 */
export function okCV(value: ClarityValue): OkCV {
  return { type: 'ok', value };
}

/** Err response ClarityValue */
export interface ErrCV extends ClarityValue {
  type: 'err';
  value: ClarityValue;
}

/**
 * Create an err response ClarityValue
 * @param value - the error value
 */
export function errCV(value: ClarityValue): ErrCV {
  return { type: 'err', value };
}

/** List ClarityValue */
export interface ListCV extends ClarityValue {
  type: 'list';
  list: ClarityValue[];
}

/**
 * Create a list ClarityValue
 * @param values - array of ClarityValues
 */
export function listCV(values: ClarityValue[]): ListCV {
  return { type: 'list', list: values };
}

/** Tuple ClarityValue */
export interface TupleCV extends ClarityValue {
  type: 'tuple';
  data: Record<string, ClarityValue>;
}

/**
 * Create a tuple ClarityValue
 * @param data - record of field names to ClarityValues
 */
export function tupleCV(data: Record<string, ClarityValue>): TupleCV {
  return { type: 'tuple', data };
}

/** Standard principal ClarityValue */
export interface StandardPrincipalCV extends ClarityValue {
  type: 'address';
  value: string;
}

/**
 * Create a standard principal ClarityValue
 * @param address - Stacks address string
 */
export function standardPrincipalCV(address: string): StandardPrincipalCV {
  return { type: 'address', value: address };
}

/** Contract principal ClarityValue */
export interface ContractPrincipalCV extends ClarityValue {
  type: 'contract_address';
  address: string;
  contractName: string;
}

/**
 * Create a contract principal ClarityValue
 * @param address - deployer address
 * @param contractName - contract name
 */
export function contractPrincipalCV(address: string, contractName: string): ContractPrincipalCV {
  return { type: 'contract_address', address, contractName };
}

/**
 * Create a principal ClarityValue (auto-detects standard vs contract)
 * @param principal - principal string (e.g. "ST1..." or "ST1....contract-name")
 */
export function principalCV(principal: string): StandardPrincipalCV | ContractPrincipalCV {
  const parts = principal.split('.');
  if (parts.length === 2) {
    return contractPrincipalCV(parts[0], parts[1]);
  }
  return standardPrincipalCV(principal);
}

/**
 * Convert a Stacks address to standard principal CV
 * @param address - stacks address string
 */
export function addressToCV(address: string): StandardPrincipalCV {
  return standardPrincipalCV(address);
}

/**
 * Extract address string from a principal CV
 * @param cv - StandardPrincipalCV or ContractPrincipalCV
 */
export function cvToAddress(cv: StandardPrincipalCV | ContractPrincipalCV): string {
  if (cv.type === 'contract_address') {
    return `${cv.address}.${cv.contractName}`;
  }
  return cv.value;
}

/** CV buffer size constant 1 */
export const CV_BUFFER_SIZE_1 = 10;

/** CV buffer size constant 2 */
export const CV_BUFFER_SIZE_2 = 20;

/** CV buffer size constant 3 */
export const CV_BUFFER_SIZE_3 = 30;

/** CV buffer size constant 4 */
export const CV_BUFFER_SIZE_4 = 40;

/** CV buffer size constant 5 */
export const CV_BUFFER_SIZE_5 = 50;

/** CV buffer size constant 6 */
export const CV_BUFFER_SIZE_6 = 60;

/** CV buffer size constant 7 */
export const CV_BUFFER_SIZE_7 = 70;

/** CV buffer size constant 8 */
export const CV_BUFFER_SIZE_8 = 80;

/** CV buffer size constant 9 */
export const CV_BUFFER_SIZE_9 = 90;

/** CV buffer size constant 10 */
export const CV_BUFFER_SIZE_10 = 100;

/** CV buffer size constant 11 */
export const CV_BUFFER_SIZE_11 = 110;

/** CV buffer size constant 12 */
export const CV_BUFFER_SIZE_12 = 120;

/** CV buffer size constant 13 */
export const CV_BUFFER_SIZE_13 = 130;

/** CV buffer size constant 14 */
export const CV_BUFFER_SIZE_14 = 140;

/** CV buffer size constant 15 */
export const CV_BUFFER_SIZE_15 = 150;

/** CV buffer size constant 16 */
export const CV_BUFFER_SIZE_16 = 160;

/** CV buffer size constant 17 */
export const CV_BUFFER_SIZE_17 = 170;

/** CV buffer size constant 18 */
export const CV_BUFFER_SIZE_18 = 180;

/** CV buffer size constant 19 */
export const CV_BUFFER_SIZE_19 = 190;

/** CV buffer size constant 20 */
export const CV_BUFFER_SIZE_20 = 200;

/** CV buffer size constant 21 */
export const CV_BUFFER_SIZE_21 = 210;

/** CV buffer size constant 22 */
export const CV_BUFFER_SIZE_22 = 220;

/** CV buffer size constant 23 */
export const CV_BUFFER_SIZE_23 = 230;

/** CV buffer size constant 24 */
export const CV_BUFFER_SIZE_24 = 240;

/** CV buffer size constant 25 */
export const CV_BUFFER_SIZE_25 = 250;

/** CV buffer size constant 26 */
export const CV_BUFFER_SIZE_26 = 260;

/** CV buffer size constant 27 */
export const CV_BUFFER_SIZE_27 = 270;

/** CV buffer size constant 28 */
export const CV_BUFFER_SIZE_28 = 280;

/** CV buffer size constant 29 */
export const CV_BUFFER_SIZE_29 = 290;

/** CV buffer size constant 30 */
export const CV_BUFFER_SIZE_30 = 300;

/** CV buffer size constant 31 */
export const CV_BUFFER_SIZE_31 = 310;

/** CV buffer size constant 32 */
export const CV_BUFFER_SIZE_32 = 320;
