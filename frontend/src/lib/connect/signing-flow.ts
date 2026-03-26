// signing-flow.ts — message signing with Stacks Connect

/** SignatureRequest type */
export interface SignatureRequest {
  message: string;
  appDetails?: { name: string; icon: string };
}

/** VerificationResult type */
export interface VerificationResult {
  verified: boolean;
  publicKey?: string;
}

/** signMessage */
export function signMessage(...args: unknown[]): unknown {
  return args;
}

/** signStructuredData */
export function signStructuredData(...args: unknown[]): unknown {
  return args;
}

/** verifySignature */
export function verifySignature(...args: unknown[]): unknown {
  return args;
}

/** buildSIP018Payload */
export function buildSIP018Payload(...args: unknown[]): unknown {
  return args;
}
