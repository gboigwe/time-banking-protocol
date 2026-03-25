/**
 * Stacks Blockchain Integration - Branded TypeScript Types
 * Provides nominal types to prevent mixing of similar primitives
 */

// ─── Brand utility ───────────────────────────────────────────────────────────

declare const _brand: unique symbol;

export type Brand<T, TBrand> = T & { readonly [_brand]: TBrand };

// ─── Address types ────────────────────────────────────────────────────────────

/** A Stacks principal address string (mainnet starts with SP, testnet with ST) */
export type StacksAddress = Brand<string, 'StacksAddress'>;

/** A Stacks contract principal in the form "ADDRESS.contract-name" */
export type ContractPrincipal = Brand<string, 'ContractPrincipal'>;

/** A standard principal or contract principal */
export type Principal = StacksAddress | ContractPrincipal;

// ─── Transaction types ───────────────────────────────────────────────────────

/** A hex-encoded transaction ID (64 hex chars) */
export type TxId = Brand<string, 'TxId'>;

/** A hex-encoded raw serialised transaction */
export type SerializedTx = Brand<string, 'SerializedTx'>;

/** A hex-encoded Clarity value */
export type ClarityHex = Brand<string, 'ClarityHex'>;

// ─── Token / credit types ────────────────────────────────────────────────────

/** An amount of micro-STX (1 STX = 1_000_000 µSTX) */
export type MicroStx = Brand<bigint, 'MicroStx'>;

/** Time credits denominated in hours (integer) */
export type TimeCredits = Brand<bigint, 'TimeCredits'>;

/** Micro-TIME tokens (1 TIME = 1_000_000 µTIME) */
export type MicroTimeToken = Brand<bigint, 'MicroTimeToken'>;

// ─── Block/time types ────────────────────────────────────────────────────────

/** A Stacks block height */
export type BlockHeight = Brand<number, 'BlockHeight'>;

/** A Unix timestamp in seconds (as returned by stacks-block-time) */
export type UnixTimestamp = Brand<number, 'UnixTimestamp'>;

/** A Stacks block hash */
export type BlockHash = Brand<string, 'BlockHash'>;

// ─── Identity types ──────────────────────────────────────────────────────────

/** An on-chain skill ID */
export type SkillId = Brand<number, 'SkillId'>;

/** An exchange ID */
export type ExchangeId = Brand<number, 'ExchangeId'>;

/** An escrow ID */
export type EscrowId = Brand<number, 'EscrowId'>;

/** A dispute ID */
export type DisputeId = Brand<number, 'DisputeId'>;

/** A governance proposal ID */
export type ProposalId = Brand<number, 'ProposalId'>;

/** A skill certification NFT token ID */
export type CertificationTokenId = Brand<bigint, 'CertificationTokenId'>;

/** A schedule ID (automation-scheduler) */
export type ScheduleId = Brand<number, 'ScheduleId'>;

// ─── Constructors ─────────────────────────────────────────────────────────────

export function stacksAddress(s: string): StacksAddress {
  return s as StacksAddress;
}

export function contractPrincipal(s: string): ContractPrincipal {
  return s as ContractPrincipal;
}

export function txId(s: string): TxId {
  return s as TxId;
}

export function microStx(n: bigint | number | string): MicroStx {
  return BigInt(n) as MicroStx;
}

export function timeCredits(n: bigint | number | string): TimeCredits {
  return BigInt(n) as TimeCredits;
}

export function microTimeToken(n: bigint | number | string): MicroTimeToken {
  return BigInt(n) as MicroTimeToken;
}

export function blockHeight(n: number): BlockHeight {
  return n as BlockHeight;
}

export function unixTimestamp(n: number): UnixTimestamp {
  return n as UnixTimestamp;
}

export function skillId(n: number): SkillId {
  return n as SkillId;
}

export function exchangeId(n: number): ExchangeId {
  return n as ExchangeId;
}

export function escrowId(n: number): EscrowId {
  return n as EscrowId;
}

export function proposalId(n: number): ProposalId {
  return n as ProposalId;
}

// ─── Guard utilities ─────────────────────────────────────────────────────────

export function isStacksAddress(s: string): s is StacksAddress {
  return /^S[PT][0-9A-Z]{38,}$/.test(s);
}

export function isContractPrincipal(s: string): s is ContractPrincipal {
  return /^S[PT][0-9A-Z]{38,}\.[a-z][a-z0-9-]{0,39}$/.test(s);
}

export function isTxId(s: string): s is TxId {
  return /^0x[0-9a-f]{64}$/.test(s) || /^[0-9a-f]{64}$/.test(s);
}

// ─── Common result types ─────────────────────────────────────────────────────

export interface Success<T> {
  ok: true;
  value: T;
}

export interface Failure<E = string> {
  ok: false;
  error: E;
}

export type Result<T, E = string> = Success<T> | Failure<E>;

export function ok<T>(value: T): Success<T> {
  return { ok: true, value };
}

export function err<E = string>(error: E): Failure<E> {
  return { ok: false, error };
}

// ─── Clarity response mapping ─────────────────────────────────────────────────

export interface ClarityOk<T> {
  type: 'ok';
  value: T;
}

export interface ClarityErr<E> {
  type: 'err';
  value: E;
}

export type ClarityResponse<T, E = number> = ClarityOk<T> | ClarityErr<E>;
