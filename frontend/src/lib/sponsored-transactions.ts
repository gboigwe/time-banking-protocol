/**
 * Sponsored Transaction Support for Stacks.js v8+
 * Enable fee sponsorship for better user experience
 */

import {
  StacksTransaction,
  sponsorTransaction,
  broadcastTransaction,
  TxBroadcastResult,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';

export interface SponsorConfig {
  network: StacksNetwork;
  sponsorPrivateKey: string;
  fee?: bigint;
}

export interface SponsorResult {
  success: boolean;
  txId?: string;
  sponsoredTx?: StacksTransaction;
  result?: TxBroadcastResult;
  error?: Error;
}

/**
 * Sponsored Transaction Manager
 * Handles fee sponsorship for user transactions
 */
export class SponsoredTransactionManager {
  private config: SponsorConfig;

  constructor(config: SponsorConfig) {
    this.config = config;
  }

  /**
   * Sponsor and broadcast a transaction
   */
  async sponsorAndBroadcast(
    transaction: StacksTransaction
  ): Promise<SponsorResult> {
    try {
      // Sponsor the transaction
      const sponsoredTx = await sponsorTransaction({
        transaction,
        sponsorPrivateKey: this.config.sponsorPrivateKey,
        fee: this.config.fee,
      });

      // Broadcast the sponsored transaction
      const result = await broadcastTransaction({
        transaction: sponsoredTx,
        network: this.config.network,
      });

      return {
        success: !result.error,
        txId: result.txid,
        sponsoredTx,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Sponsor a transaction without broadcasting
   */
  async sponsor(transaction: StacksTransaction): Promise<StacksTransaction> {
    return sponsorTransaction({
      transaction,
      sponsorPrivateKey: this.config.sponsorPrivateKey,
      fee: this.config.fee,
    });
  }

  /**
   * Update sponsor configuration
   */
  updateConfig(config: Partial<SponsorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current sponsor address
   */
  getSponsorAddress(): string {
    // Extract address from private key
    // This would require additional logic in production
    return 'sponsor-address';
  }
}

/**
 * Helper function to create a sponsored transaction manager
 */
export function createSponsorManager(
  config: SponsorConfig
): SponsoredTransactionManager {
  return new SponsoredTransactionManager(config);
}

/**
 * Quick sponsor and broadcast helper
 */
export async function quickSponsor(
  transaction: StacksTransaction,
  config: SponsorConfig
): Promise<SponsorResult> {
  const manager = new SponsoredTransactionManager(config);
  return manager.sponsorAndBroadcast(transaction);
}
