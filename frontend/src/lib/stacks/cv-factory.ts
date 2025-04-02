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
