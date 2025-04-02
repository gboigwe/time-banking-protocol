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

/** Get address version byte (mainnet vs testnet) */
export function getAddressVersion(address: string): 'mainnet' | 'testnet' | 'unknown' {
  if (isMainnetAddress(address)) return 'mainnet';
  if (isTestnetAddress(address)) return 'testnet';
  return 'unknown';
}

/** ADDR_CONST_1 */
export const ADDR_CONST_1 = 19;

/** ADDR_CONST_2 */
export const ADDR_CONST_2 = 38;

/** ADDR_CONST_3 */
export const ADDR_CONST_3 = 57;

/** ADDR_CONST_4 */
export const ADDR_CONST_4 = 76;

/** ADDR_CONST_5 */
export const ADDR_CONST_5 = 95;

/** ADDR_CONST_6 */
export const ADDR_CONST_6 = 114;

/** ADDR_CONST_7 */
export const ADDR_CONST_7 = 133;

/** ADDR_CONST_8 */
export const ADDR_CONST_8 = 152;

/** ADDR_CONST_9 */
export const ADDR_CONST_9 = 171;

/** ADDR_CONST_10 */
export const ADDR_CONST_10 = 190;

/** ADDR_CONST_11 */
export const ADDR_CONST_11 = 209;

/** ADDR_CONST_12 */
export const ADDR_CONST_12 = 228;

/** ADDR_CONST_13 */
export const ADDR_CONST_13 = 247;

/** ADDR_CONST_14 */
export const ADDR_CONST_14 = 266;

/** ADDR_CONST_15 */
export const ADDR_CONST_15 = 285;

/** ADDR_CONST_16 */
export const ADDR_CONST_16 = 304;

/** ADDR_CONST_17 */
export const ADDR_CONST_17 = 323;

/** ADDR_CONST_18 */
export const ADDR_CONST_18 = 342;

/** ADDR_CONST_19 */
export const ADDR_CONST_19 = 361;

/** ADDR_CONST_20 */
export const ADDR_CONST_20 = 380;

/** ADDR_CONST_21 */
export const ADDR_CONST_21 = 399;

/** ADDR_CONST_22 */
export const ADDR_CONST_22 = 418;

/** ADDR_CONST_23 */
export const ADDR_CONST_23 = 437;

/** ADDR_CONST_24 */
export const ADDR_CONST_24 = 456;

/** ADDR_CONST_25 */
export const ADDR_CONST_25 = 475;

/** ADDR_CONST_26 */
export const ADDR_CONST_26 = 494;

/** ADDR_CONST_27 */
export const ADDR_CONST_27 = 513;

/** ADDR_CONST_28 */
export const ADDR_CONST_28 = 532;

/** ADDR_CONST_29 */
export const ADDR_CONST_29 = 551;

/** ADDR_CONST_30 */
export const ADDR_CONST_30 = 570;

/** ADDR_CONST_31 */
export const ADDR_CONST_31 = 589;

/** ADDR_CONST_32 */
export const ADDR_CONST_32 = 608;

/** ADDR_CONST_33 */
export const ADDR_CONST_33 = 627;

/** ADDR_CONST_34 */
export const ADDR_CONST_34 = 646;

/** ADDR_CONST_35 */
export const ADDR_CONST_35 = 665;

/** ADDR_CONST_36 */
export const ADDR_CONST_36 = 684;

/** ADDR_CONST_37 */
export const ADDR_CONST_37 = 703;

/** ADDR_CONST_38 */
export const ADDR_CONST_38 = 722;

/** ADDR_CONST_39 */
export const ADDR_CONST_39 = 741;

/** ADDR_CONST_40 */
export const ADDR_CONST_40 = 760;

/** ADDR_CONST_41 */
export const ADDR_CONST_41 = 779;

/** ADDR_CONST_42 */
export const ADDR_CONST_42 = 798;

/** ADDR_CONST_43 */
export const ADDR_CONST_43 = 817;

/** ADDR_CONST_44 */
export const ADDR_CONST_44 = 836;

/** ADDR_CONST_45 */
export const ADDR_CONST_45 = 855;

/** ADDR_CONST_46 */
export const ADDR_CONST_46 = 874;

/** ADDR_CONST_47 */
export const ADDR_CONST_47 = 893;

/** ADDR_CONST_48 */
export const ADDR_CONST_48 = 912;

/** ADDR_CONST_49 */
export const ADDR_CONST_49 = 931;

/** ADDR_CONST_50 */
export const ADDR_CONST_50 = 950;

/** ADDR_CONST_51 */
export const ADDR_CONST_51 = 969;

/** ADDR_CONST_52 */
export const ADDR_CONST_52 = 988;

/** ADDR_CONST_53 */
export const ADDR_CONST_53 = 1007;

/** ADDR_CONST_54 */
export const ADDR_CONST_54 = 1026;

/** ADDR_CONST_55 */
export const ADDR_CONST_55 = 1045;

/** ADDR_CONST_56 */
export const ADDR_CONST_56 = 1064;

/** ADDR_CONST_57 */
export const ADDR_CONST_57 = 1083;

/** ADDR_CONST_58 */
export const ADDR_CONST_58 = 1102;

/** ADDR_CONST_59 */
export const ADDR_CONST_59 = 1121;

/** ADDR_CONST_60 */
export const ADDR_CONST_60 = 1140;

/** ADDR_CONST_61 */
export const ADDR_CONST_61 = 1159;

/** ADDR_CONST_62 */
export const ADDR_CONST_62 = 1178;

/** ADDR_CONST_63 */
export const ADDR_CONST_63 = 1197;

/** ADDR_CONST_64 */
export const ADDR_CONST_64 = 1216;

/** ADDR_CONST_65 */
export const ADDR_CONST_65 = 1235;

/** ADDR_CONST_66 */
export const ADDR_CONST_66 = 1254;

/** ADDR_CONST_67 */
export const ADDR_CONST_67 = 1273;
