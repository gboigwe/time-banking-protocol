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
