// post-condition-factory.ts — builders for Stacks post-conditions

/** Fungible condition code */
export enum FungibleConditionCode {
  Equal = 0x01,
  Greater = 0x02,
  GreaterEqual = 0x03,
  Less = 0x04,
  LessEqual = 0x05,
}

/** Non-fungible condition code */
export enum NonFungibleConditionCode {
  Sends = 0x10,
  DoesNotSend = 0x11,
}

/** STX post-condition builder */
export function makeSTXPostCondition(
  address: string,
  code: FungibleConditionCode,
  amount: bigint
): Record<string, unknown> {
  return { type: 'stx', address, code, amount: amount.toString() };
}

/** FT post-condition builder */
export function makeFTPostCondition(
  address: string,
  assetInfo: string,
  code: FungibleConditionCode,
  amount: bigint
): Record<string, unknown> {
  return { type: 'ft', address, assetInfo, code, amount: amount.toString() };
}

/** NFT post-condition builder */
export function makeNFTPostCondition(
  address: string,
  assetInfo: string,
  code: NonFungibleConditionCode,
  tokenId: unknown
): Record<string, unknown> {
  return { type: 'nft', address, assetInfo, code, tokenId };
}

/** POST_COND_1 */
export const POST_COND_1 = 13;

/** POST_COND_2 */
export const POST_COND_2 = 26;

/** POST_COND_3 */
export const POST_COND_3 = 39;

/** POST_COND_4 */
export const POST_COND_4 = 52;

/** POST_COND_5 */
export const POST_COND_5 = 65;

/** POST_COND_6 */
export const POST_COND_6 = 78;

/** POST_COND_7 */
export const POST_COND_7 = 91;

/** POST_COND_8 */
export const POST_COND_8 = 104;

/** POST_COND_9 */
export const POST_COND_9 = 117;

/** POST_COND_10 */
export const POST_COND_10 = 130;

/** POST_COND_11 */
export const POST_COND_11 = 143;

/** POST_COND_12 */
export const POST_COND_12 = 156;

/** POST_COND_13 */
export const POST_COND_13 = 169;

/** POST_COND_14 */
export const POST_COND_14 = 182;

/** POST_COND_15 */
export const POST_COND_15 = 195;

/** POST_COND_16 */
export const POST_COND_16 = 208;

/** POST_COND_17 */
export const POST_COND_17 = 221;

/** POST_COND_18 */
export const POST_COND_18 = 234;

/** POST_COND_19 */
export const POST_COND_19 = 247;

/** POST_COND_20 */
export const POST_COND_20 = 260;

/** POST_COND_21 */
export const POST_COND_21 = 273;

/** POST_COND_22 */
export const POST_COND_22 = 286;

/** POST_COND_23 */
export const POST_COND_23 = 299;

/** POST_COND_24 */
export const POST_COND_24 = 312;

/** POST_COND_25 */
export const POST_COND_25 = 325;

/** POST_COND_26 */
export const POST_COND_26 = 338;

/** POST_COND_27 */
export const POST_COND_27 = 351;

/** POST_COND_28 */
export const POST_COND_28 = 364;

/** POST_COND_29 */
export const POST_COND_29 = 377;

/** POST_COND_30 */
export const POST_COND_30 = 390;

/** POST_COND_31 */
export const POST_COND_31 = 403;

/** POST_COND_32 */
export const POST_COND_32 = 416;

/** POST_COND_33 */
export const POST_COND_33 = 429;

/** POST_COND_34 */
export const POST_COND_34 = 442;

/** POST_COND_35 */
export const POST_COND_35 = 455;

/** POST_COND_36 */
export const POST_COND_36 = 468;

/** POST_COND_37 */
export const POST_COND_37 = 481;

/** POST_COND_38 */
export const POST_COND_38 = 494;

/** POST_COND_39 */
export const POST_COND_39 = 507;

/** POST_COND_40 */
export const POST_COND_40 = 520;

/** POST_COND_41 */
export const POST_COND_41 = 533;

/** POST_COND_42 */
export const POST_COND_42 = 546;

/** POST_COND_43 */
export const POST_COND_43 = 559;
