// contract-call-flow.ts — Stacks Connect contract call flow

/** Call status enum */
export enum CallStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}
