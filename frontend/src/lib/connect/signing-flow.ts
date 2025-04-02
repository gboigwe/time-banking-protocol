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
