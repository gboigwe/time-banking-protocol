/**
 * Message Signing Utilities
 * Sign structured data and plain messages with Stacks wallets
 */

import {
  openSignatureRequestPopup,
  openStructuredDataSignatureRequestPopup,
} from '@stacks/connect';
import { verifyMessageSignatureRsv, getAddressFromPublicKey } from '@stacks/encryption';
import {
  createStacksPrivateKey,
  publicKeyFromSignatureRsv,
  stringAsciiCV,
  tupleCV,
  uintCV,
  bufferCV,
} from '@stacks/transactions';
import type { UserSession } from '@stacks/auth';
import type { AppDetails } from '@stacks/connect';

export interface SignedMessage {
  message: string;
  signature: string;
  publicKey: string;
  address: string;
  signedAt: number;
}

export interface StructuredSignatureData {
  message: Record<string, unknown>;
  domain: {
    name: string;
    version: string;
    chainId: number;
  };
}

export interface SignatureVerifyResult {
  valid: boolean;
  address?: string;
  publicKey?: string;
}

export interface MessageSigningConfig {
  appDetails: AppDetails;
  userSession: UserSession;
  network?: 'mainnet' | 'testnet';
}

export class MessageSigner {
  private config: MessageSigningConfig;

  constructor(config: MessageSigningConfig) {
    this.config = config;
  }

  /**
   * Signs a plain text message using the wallet
   */
  async signMessage(message: string): Promise<SignedMessage> {
    return new Promise((resolve, reject) => {
      openSignatureRequestPopup({
        message,
        appDetails: this.config.appDetails,
        userSession: this.config.userSession,
        onFinish: ({ signature, publicKey }) => {
          resolve({
            message,
            signature,
            publicKey,
            address: getAddressFromPublicKey(publicKey, this.config.network === 'mainnet' ? 22 : 26),
            signedAt: Date.now(),
          });
        },
        onCancel: () => reject(new Error('User cancelled signature request')),
      });
    });
  }

  /**
   * Signs a structured data payload (SIP-018 compatible)
   */
  async signStructuredData(data: StructuredSignatureData): Promise<SignedMessage> {
    const messageCV = this.buildMessageCV(data.message);
    const domainCV = tupleCV({
      name: stringAsciiCV(data.domain.name),
      version: stringAsciiCV(data.domain.version),
      'chain-id': uintCV(BigInt(data.domain.chainId)),
    });

    return new Promise((resolve, reject) => {
      openStructuredDataSignatureRequestPopup({
        message: messageCV,
        domain: domainCV,
        appDetails: this.config.appDetails,
        userSession: this.config.userSession,
        onFinish: ({ signature, publicKey }) => {
          resolve({
            message: JSON.stringify(data.message),
            signature,
            publicKey,
            address: getAddressFromPublicKey(publicKey, this.config.network === 'mainnet' ? 22 : 26),
            signedAt: Date.now(),
          });
        },
        onCancel: () => reject(new Error('User cancelled structured signature')),
      });
    });
  }

  /**
   * Verifies a signed message
   */
  verifySignature(message: string, signature: string, expectedAddress?: string): SignatureVerifyResult {
    try {
      const isValid = verifyMessageSignatureRsv({ message, signature });
      if (!isValid) return { valid: false };

      const publicKey = publicKeyFromSignatureRsv(message, signature);
      const addressVersion = this.config.network === 'mainnet' ? 22 : 26;
      const recoveredAddress = getAddressFromPublicKey(publicKey, addressVersion);

      const valid = expectedAddress ? recoveredAddress === expectedAddress : true;
      return { valid, address: recoveredAddress, publicKey };
    } catch {
      return { valid: false };
    }
  }

  /**
   * Creates a sign-in proof message for authentication
   */
  createAuthMessage(address: string, nonce: string, timestamp: number): string {
    return [
      'Sign in to Time Banking Protocol',
      '',
      `Address: ${address}`,
      `Nonce: ${nonce}`,
      `Issued At: ${new Date(timestamp).toISOString()}`,
      '',
      'By signing this message you confirm ownership of this address.',
    ].join('\n');
  }

  /**
   * Builds a Clarity tuple CV from a plain object (shallow)
   */
  private buildMessageCV(obj: Record<string, unknown>) {
    const entries: Record<string, ReturnType<typeof stringAsciiCV>> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'string') {
        entries[key] = stringAsciiCV(val.slice(0, 128));
      } else if (typeof val === 'number' || typeof val === 'bigint') {
        entries[key] = uintCV(BigInt(val)) as any;
      }
    }
    return tupleCV(entries);
  }
}

export function createMessageSigner(config: MessageSigningConfig): MessageSigner {
  return new MessageSigner(config);
}
