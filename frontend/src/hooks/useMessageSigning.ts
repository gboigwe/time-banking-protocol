/**
 * useMessageSigning - React hook for wallet message signing
 */

import { useState, useCallback, useRef } from 'react';
import {
  MessageSigner,
  SignedMessage,
  createMessageSigner,
  MessageSigningConfig,
} from '../lib/message-signing';

export interface MessageSigningState {
  signedMessage: SignedMessage | null;
  isSigning: boolean;
  error: string | null;
}

export interface UseMessageSigningResult extends MessageSigningState {
  signMessage: (message: string) => Promise<SignedMessage>;
  createAuthMessage: (address: string, nonce: string) => string;
  verifySignature: (
    message: string,
    signature: string,
    expectedAddress?: string
  ) => { valid: boolean; address?: string };
  clearResult: () => void;
  signer: MessageSigner;
}

export function useMessageSigning(
  config: MessageSigningConfig,
  externalSigner?: MessageSigner
): UseMessageSigningResult {
  const signerRef = useRef<MessageSigner>(
    externalSigner ?? createMessageSigner(config)
  );

  const [state, setState] = useState<MessageSigningState>({
    signedMessage: null,
    isSigning: false,
    error: null,
  });

  const signMessage = useCallback(async (message: string): Promise<SignedMessage> => {
    setState({ signedMessage: null, isSigning: true, error: null });
    try {
      const signed = await signerRef.current.signMessage(message);
      setState({ signedMessage: signed, isSigning: false, error: null });
      return signed;
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Signing failed';
      setState(s => ({ ...s, isSigning: false, error }));
      throw e;
    }
  }, []);

  const createAuthMessage = useCallback(
    (address: string, nonce: string): string => {
      return signerRef.current.createAuthMessage(address, nonce, Date.now());
    },
    []
  );

  const verifySignature = useCallback(
    (message: string, signature: string, expectedAddress?: string) =>
      signerRef.current.verifySignature(message, signature, expectedAddress),
    []
  );

  const clearResult = useCallback(() => {
    setState({ signedMessage: null, isSigning: false, error: null });
  }, []);

  return {
    ...state,
    signMessage,
    createAuthMessage,
    verifySignature,
    clearResult,
    signer: signerRef.current,
  };
}
