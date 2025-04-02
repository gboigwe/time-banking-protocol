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

/** CV buffer size constant 33 */
export const CV_BUFFER_SIZE_33 = 330;

/** CV buffer size constant 34 */
export const CV_BUFFER_SIZE_34 = 340;

/** CV buffer size constant 35 */
export const CV_BUFFER_SIZE_35 = 350;

/** CV buffer size constant 36 */
export const CV_BUFFER_SIZE_36 = 360;

/** CV buffer size constant 37 */
export const CV_BUFFER_SIZE_37 = 370;

/** CV buffer size constant 38 */
export const CV_BUFFER_SIZE_38 = 380;

/** CV buffer size constant 39 */
export const CV_BUFFER_SIZE_39 = 390;

/** CV buffer size constant 40 */
export const CV_BUFFER_SIZE_40 = 400;

/** CV buffer size constant 41 */
export const CV_BUFFER_SIZE_41 = 410;

/** CV buffer size constant 42 */
export const CV_BUFFER_SIZE_42 = 420;

/** CV buffer size constant 43 */
export const CV_BUFFER_SIZE_43 = 430;

/** CV buffer size constant 44 */
export const CV_BUFFER_SIZE_44 = 440;

/** CV buffer size constant 45 */
export const CV_BUFFER_SIZE_45 = 450;

/** CV buffer size constant 46 */
export const CV_BUFFER_SIZE_46 = 460;

/** CV buffer size constant 47 */
export const CV_BUFFER_SIZE_47 = 470;

/** CV buffer size constant 48 */
export const CV_BUFFER_SIZE_48 = 480;

/** CV buffer size constant 49 */
export const CV_BUFFER_SIZE_49 = 490;

/** CV buffer size constant 50 */
export const CV_BUFFER_SIZE_50 = 500;

/** CV buffer size constant 51 */
export const CV_BUFFER_SIZE_51 = 510;

/** CV buffer size constant 52 */
export const CV_BUFFER_SIZE_52 = 520;

/** CV buffer size constant 53 */
export const CV_BUFFER_SIZE_53 = 530;

/** CV buffer size constant 54 */
export const CV_BUFFER_SIZE_54 = 540;

/** CV buffer size constant 55 */
export const CV_BUFFER_SIZE_55 = 550;

/** CV buffer size constant 56 */
export const CV_BUFFER_SIZE_56 = 560;

/** CV buffer size constant 57 */
export const CV_BUFFER_SIZE_57 = 570;

/** CV buffer size constant 58 */
export const CV_BUFFER_SIZE_58 = 580;

/** CV buffer size constant 59 */
export const CV_BUFFER_SIZE_59 = 590;

/** CV buffer size constant 60 */
export const CV_BUFFER_SIZE_60 = 600;

/** CV buffer size constant 61 */
export const CV_BUFFER_SIZE_61 = 610;

/** CV buffer size constant 62 */
export const CV_BUFFER_SIZE_62 = 620;

/** CV buffer size constant 63 */
export const CV_BUFFER_SIZE_63 = 630;

/** CV buffer size constant 64 */
export const CV_BUFFER_SIZE_64 = 640;

/** CV buffer size constant 65 */
export const CV_BUFFER_SIZE_65 = 650;

/** CV buffer size constant 66 */
export const CV_BUFFER_SIZE_66 = 660;

/** CV buffer size constant 67 */
export const CV_BUFFER_SIZE_67 = 670;

/** CV buffer size constant 68 */
export const CV_BUFFER_SIZE_68 = 680;

/** CV buffer size constant 69 */
export const CV_BUFFER_SIZE_69 = 690;

/** CV buffer size constant 70 */
export const CV_BUFFER_SIZE_70 = 700;

/** CV buffer size constant 71 */
export const CV_BUFFER_SIZE_71 = 710;

/** CV buffer size constant 72 */
export const CV_BUFFER_SIZE_72 = 720;

/** CV buffer size constant 73 */
export const CV_BUFFER_SIZE_73 = 730;

/** CV buffer size constant 74 */
export const CV_BUFFER_SIZE_74 = 740;

/** CV buffer size constant 75 */
export const CV_BUFFER_SIZE_75 = 750;

/** CV buffer size constant 76 */
export const CV_BUFFER_SIZE_76 = 760;

/** CV buffer size constant 77 */
export const CV_BUFFER_SIZE_77 = 770;

/** CV buffer size constant 78 */
export const CV_BUFFER_SIZE_78 = 780;

/** CV buffer size constant 79 */
export const CV_BUFFER_SIZE_79 = 790;

/** CV buffer size constant 80 */
export const CV_BUFFER_SIZE_80 = 800;

/** CV buffer size constant 81 */
export const CV_BUFFER_SIZE_81 = 810;

/** CV buffer size constant 82 */
export const CV_BUFFER_SIZE_82 = 820;

/** CV buffer size constant 83 */
export const CV_BUFFER_SIZE_83 = 830;

/** CV buffer size constant 84 */
export const CV_BUFFER_SIZE_84 = 840;

/** CV buffer size constant 85 */
export const CV_BUFFER_SIZE_85 = 850;

/** CV buffer size constant 86 */
export const CV_BUFFER_SIZE_86 = 860;

/** CV buffer size constant 87 */
export const CV_BUFFER_SIZE_87 = 870;

/** CV buffer size constant 88 */
export const CV_BUFFER_SIZE_88 = 880;

/** CV buffer size constant 89 */
export const CV_BUFFER_SIZE_89 = 890;

/** CV buffer size constant 90 */
export const CV_BUFFER_SIZE_90 = 900;

/** CV buffer size constant 91 */
export const CV_BUFFER_SIZE_91 = 910;

/** CV buffer size constant 92 */
export const CV_BUFFER_SIZE_92 = 920;

/** CV buffer size constant 93 */
export const CV_BUFFER_SIZE_93 = 930;

/** CV buffer size constant 94 */
export const CV_BUFFER_SIZE_94 = 940;

/** CV buffer size constant 95 */
export const CV_BUFFER_SIZE_95 = 950;

/** CV buffer size constant 96 */
export const CV_BUFFER_SIZE_96 = 960;

/** CV buffer size constant 97 */
export const CV_BUFFER_SIZE_97 = 970;

/** CV buffer size constant 98 */
export const CV_BUFFER_SIZE_98 = 980;

/** CV buffer size constant 99 */
export const CV_BUFFER_SIZE_99 = 990;

/** CV buffer size constant 100 */
export const CV_BUFFER_SIZE_100 = 1000;
