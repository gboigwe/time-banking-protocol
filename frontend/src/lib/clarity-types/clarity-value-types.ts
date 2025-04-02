// clarity-value-types.ts — ClarityValue shape definitions for Stacks.js interop
/** ClarityType enum maps to Stacks.js clarity type identifiers */
export enum ClarityType {
  Int = 'int',
  UInt = 'uint',
  Buffer = 'buffer',
  BoolTrue = 'true',
  BoolFalse = 'false',
  StandardPrincipal = 'address',
  ContractPrincipal = 'contract_address',
  ResponseOk = 'ok',
  ResponseErr = 'err',
  OptionalNone = 'none',
  OptionalSome = 'some',
  List = 'list',
  Tuple = 'tuple',
  StringASCII = 'string-ascii',
  StringUTF8 = 'string-utf8',
}

/** Minimal ClarityValue shape used in read-only call results */
export interface ClarityValueShape {
  type: ClarityType;
  value?: unknown;
}

/** Check if a value is a ClarityValueShape */
export function isClarityValue(v: unknown): v is ClarityValueShape {
  return typeof v === 'object' && v !== null && 'type' in v;
}

/** Extract inner value from a Clarity optional/some */
export function unwrapSome(v: ClarityValueShape): unknown | null {
  if (v.type === ClarityType.OptionalNone) return null;
  if (v.type === ClarityType.OptionalSome) return v.value;
  return v.value ?? null;
}

/** Map ClarityType to its TypeScript equivalent type name */
export const CLARITY_TYPE_TS_MAP: Record<ClarityType, string> = {
  [ClarityType.Int]: 'bigint',
  [ClarityType.UInt]: 'bigint',
  [ClarityType.Buffer]: 'Uint8Array',
  [ClarityType.BoolTrue]: 'true',
  [ClarityType.BoolFalse]: 'false',
  [ClarityType.StandardPrincipal]: 'string',
  [ClarityType.ContractPrincipal]: 'string',
  [ClarityType.ResponseOk]: 'ClarityValueShape',
  [ClarityType.ResponseErr]: 'ClarityValueShape',
  [ClarityType.OptionalNone]: 'null',
  [ClarityType.OptionalSome]: 'ClarityValueShape',
  [ClarityType.List]: 'ClarityValueShape[]',
  [ClarityType.Tuple]: 'Record<string, ClarityValueShape>',
  [ClarityType.StringASCII]: 'string',
  [ClarityType.StringUTF8]: 'string',
};

/** Check if ClarityType is a principal type */
export function isPrincipalType(type: ClarityType): boolean {
  return type === ClarityType.StandardPrincipal || type === ClarityType.ContractPrincipal;
}

/** Check if ClarityType is a numeric type */
export function isNumericType(type: ClarityType): boolean {
  return type === ClarityType.Int || type === ClarityType.UInt;
}
