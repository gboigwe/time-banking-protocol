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
