// contract-call-flow.ts — Stacks Connect contract call flow

/** Call status enum */
export enum CallStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}
export const CALL_STATUS_IDLE: CallStatus = CallStatus.Idle;
export const CALL_STATUS_PENDING: CallStatus = CallStatus.Pending;
export const CALL_STATUS_SUCCESS: CallStatus = CallStatus.Success;
export const CALL_STATUS_FAILED: CallStatus = CallStatus.Failed;

/** buildContractCallRequest */
export function buildContractCallRequest(...args: unknown[]): unknown {
  return args;
}
