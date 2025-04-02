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
