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

/** CV buffer size constant 101 */
export const CV_BUFFER_SIZE_101 = 1010;

/** CV buffer size constant 102 */
export const CV_BUFFER_SIZE_102 = 1020;

/** CV buffer size constant 103 */
export const CV_BUFFER_SIZE_103 = 1030;

/** CV buffer size constant 104 */
export const CV_BUFFER_SIZE_104 = 1040;

/** CV buffer size constant 105 */
export const CV_BUFFER_SIZE_105 = 1050;

/** CV buffer size constant 106 */
export const CV_BUFFER_SIZE_106 = 1060;

/** CV buffer size constant 107 */
export const CV_BUFFER_SIZE_107 = 1070;

/** CV buffer size constant 108 */
export const CV_BUFFER_SIZE_108 = 1080;

/** CV buffer size constant 109 */
export const CV_BUFFER_SIZE_109 = 1090;

/** CV buffer size constant 110 */
export const CV_BUFFER_SIZE_110 = 1100;

/** CV buffer size constant 111 */
export const CV_BUFFER_SIZE_111 = 1110;

/** CV buffer size constant 112 */
export const CV_BUFFER_SIZE_112 = 1120;

/** CV buffer size constant 113 */
export const CV_BUFFER_SIZE_113 = 1130;

/** CV buffer size constant 114 */
export const CV_BUFFER_SIZE_114 = 1140;

/** CV buffer size constant 115 */
export const CV_BUFFER_SIZE_115 = 1150;

/** CV buffer size constant 116 */
export const CV_BUFFER_SIZE_116 = 1160;

/** CV buffer size constant 117 */
export const CV_BUFFER_SIZE_117 = 1170;

/** CV buffer size constant 118 */
export const CV_BUFFER_SIZE_118 = 1180;

/** CV buffer size constant 119 */
export const CV_BUFFER_SIZE_119 = 1190;

/** CV buffer size constant 120 */
export const CV_BUFFER_SIZE_120 = 1200;

/** CV buffer size constant 121 */
export const CV_BUFFER_SIZE_121 = 1210;

/** CV buffer size constant 122 */
export const CV_BUFFER_SIZE_122 = 1220;

/** CV buffer size constant 123 */
export const CV_BUFFER_SIZE_123 = 1230;

/** CV buffer size constant 124 */
export const CV_BUFFER_SIZE_124 = 1240;

/** CV buffer size constant 125 */
export const CV_BUFFER_SIZE_125 = 1250;

/** CV buffer size constant 126 */
export const CV_BUFFER_SIZE_126 = 1260;

/** CV buffer size constant 127 */
export const CV_BUFFER_SIZE_127 = 1270;

/** CV buffer size constant 128 */
export const CV_BUFFER_SIZE_128 = 1280;

/** CV buffer size constant 129 */
export const CV_BUFFER_SIZE_129 = 1290;

/** CV buffer size constant 130 */
export const CV_BUFFER_SIZE_130 = 1300;

/** CV buffer size constant 131 */
export const CV_BUFFER_SIZE_131 = 1310;

/** CV buffer size constant 132 */
export const CV_BUFFER_SIZE_132 = 1320;

/** CV buffer size constant 133 */
export const CV_BUFFER_SIZE_133 = 1330;

/** CV buffer size constant 134 */
export const CV_BUFFER_SIZE_134 = 1340;

/** CV buffer size constant 135 */
export const CV_BUFFER_SIZE_135 = 1350;

/** CV buffer size constant 136 */
export const CV_BUFFER_SIZE_136 = 1360;

/** CV buffer size constant 137 */
export const CV_BUFFER_SIZE_137 = 1370;

/** CV buffer size constant 138 */
export const CV_BUFFER_SIZE_138 = 1380;

/** CV buffer size constant 139 */
export const CV_BUFFER_SIZE_139 = 1390;

/** CV buffer size constant 140 */
export const CV_BUFFER_SIZE_140 = 1400;

/** CV buffer size constant 141 */
export const CV_BUFFER_SIZE_141 = 1410;

/** CV buffer size constant 142 */
export const CV_BUFFER_SIZE_142 = 1420;

/** CV buffer size constant 143 */
export const CV_BUFFER_SIZE_143 = 1430;

/** CV buffer size constant 144 */
export const CV_BUFFER_SIZE_144 = 1440;

/** CV buffer size constant 145 */
export const CV_BUFFER_SIZE_145 = 1450;

/** CV buffer size constant 146 */
export const CV_BUFFER_SIZE_146 = 1460;

/** CV buffer size constant 147 */
export const CV_BUFFER_SIZE_147 = 1470;

/** CV buffer size constant 148 */
export const CV_BUFFER_SIZE_148 = 1480;

/** CV buffer size constant 149 */
export const CV_BUFFER_SIZE_149 = 1490;

/** CV buffer size constant 150 */
export const CV_BUFFER_SIZE_150 = 1500;

/** CV buffer size constant 151 */
export const CV_BUFFER_SIZE_151 = 1510;

/** CV buffer size constant 152 */
export const CV_BUFFER_SIZE_152 = 1520;

/** CV buffer size constant 153 */
export const CV_BUFFER_SIZE_153 = 1530;

/** CV buffer size constant 154 */
export const CV_BUFFER_SIZE_154 = 1540;

/** CV buffer size constant 155 */
export const CV_BUFFER_SIZE_155 = 1550;

/** CV buffer size constant 156 */
export const CV_BUFFER_SIZE_156 = 1560;

/** CV buffer size constant 157 */
export const CV_BUFFER_SIZE_157 = 1570;

/** CV buffer size constant 158 */
export const CV_BUFFER_SIZE_158 = 1580;

/** CV buffer size constant 159 */
export const CV_BUFFER_SIZE_159 = 1590;

/** CV buffer size constant 160 */
export const CV_BUFFER_SIZE_160 = 1600;

/** CV buffer size constant 161 */
export const CV_BUFFER_SIZE_161 = 1610;

/** CV buffer size constant 162 */
export const CV_BUFFER_SIZE_162 = 1620;

/** CV buffer size constant 163 */
export const CV_BUFFER_SIZE_163 = 1630;

/** CV buffer size constant 164 */
export const CV_BUFFER_SIZE_164 = 1640;

/** CV buffer size constant 165 */
export const CV_BUFFER_SIZE_165 = 1650;

/** CV buffer size constant 166 */
export const CV_BUFFER_SIZE_166 = 1660;

/** CV buffer size constant 167 */
export const CV_BUFFER_SIZE_167 = 1670;

/** CV buffer size constant 168 */
export const CV_BUFFER_SIZE_168 = 1680;

/** CV buffer size constant 169 */
export const CV_BUFFER_SIZE_169 = 1690;

/** CV buffer size constant 170 */
export const CV_BUFFER_SIZE_170 = 1700;

/** CV buffer size constant 171 */
export const CV_BUFFER_SIZE_171 = 1710;

/** CV buffer size constant 172 */
export const CV_BUFFER_SIZE_172 = 1720;

/** CV buffer size constant 173 */
export const CV_BUFFER_SIZE_173 = 1730;

/** CV buffer size constant 174 */
export const CV_BUFFER_SIZE_174 = 1740;

/** CV buffer size constant 175 */
export const CV_BUFFER_SIZE_175 = 1750;

/** CV buffer size constant 176 */
export const CV_BUFFER_SIZE_176 = 1760;

/** CV buffer size constant 177 */
export const CV_BUFFER_SIZE_177 = 1770;

/** CV buffer size constant 178 */
export const CV_BUFFER_SIZE_178 = 1780;

/** CV buffer size constant 179 */
export const CV_BUFFER_SIZE_179 = 1790;

/** CV buffer size constant 180 */
export const CV_BUFFER_SIZE_180 = 1800;

/** CV buffer size constant 181 */
export const CV_BUFFER_SIZE_181 = 1810;

/** CV buffer size constant 182 */
export const CV_BUFFER_SIZE_182 = 1820;

/** CV buffer size constant 183 */
export const CV_BUFFER_SIZE_183 = 1830;

/** CV buffer size constant 184 */
export const CV_BUFFER_SIZE_184 = 1840;

/** CV buffer size constant 185 */
export const CV_BUFFER_SIZE_185 = 1850;

/** CV buffer size constant 186 */
export const CV_BUFFER_SIZE_186 = 1860;

/** CV buffer size constant 187 */
export const CV_BUFFER_SIZE_187 = 1870;

/** CV buffer size constant 188 */
export const CV_BUFFER_SIZE_188 = 1880;

/** CV buffer size constant 189 */
export const CV_BUFFER_SIZE_189 = 1890;

/** CV buffer size constant 190 */
export const CV_BUFFER_SIZE_190 = 1900;

/** CV buffer size constant 191 */
export const CV_BUFFER_SIZE_191 = 1910;

/** CV buffer size constant 192 */
export const CV_BUFFER_SIZE_192 = 1920;

/** CV buffer size constant 193 */
export const CV_BUFFER_SIZE_193 = 1930;
