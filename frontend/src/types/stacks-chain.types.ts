// stacks-chain.types.ts — Stacks blockchain specific types

/** BlockHeight on-chain type */
export type BlockHeight = string;

/** BlockTime on-chain type */
export type BlockTime = string;

/** StacksPrincipal on-chain type */
export type StacksPrincipal = string;

/** TxId on-chain type */
export type TxId = string;

/** ContractId on-chain type */
export type ContractId = string;

/** ClarityVersion on-chain type */
export type ClarityVersion = string;

/** EpochVersion on-chain type */
export type EpochVersion = string;

/** CHAIN_BRAND type alias 1 */
export type CHAIN_BRAND_1 = string & { readonly _brand: 'CHAIN_BRAND_1' };

/** CHAIN_BRAND type alias 2 */
export type CHAIN_BRAND_2 = string & { readonly _brand: 'CHAIN_BRAND_2' };

/** CHAIN_BRAND type alias 3 */
export type CHAIN_BRAND_3 = string & { readonly _brand: 'CHAIN_BRAND_3' };

/** CHAIN_BRAND type alias 4 */
export type CHAIN_BRAND_4 = string & { readonly _brand: 'CHAIN_BRAND_4' };

/** CHAIN_BRAND type alias 5 */
export type CHAIN_BRAND_5 = string & { readonly _brand: 'CHAIN_BRAND_5' };

/** CHAIN_BRAND type alias 6 */
export type CHAIN_BRAND_6 = string & { readonly _brand: 'CHAIN_BRAND_6' };

/** CHAIN_BRAND type alias 7 */
export type CHAIN_BRAND_7 = string & { readonly _brand: 'CHAIN_BRAND_7' };
