/**
 * Hiro Wallet Connector for Reown AppKit
 * Supports Hiro browser extension (desktop only)
 */

import { XverseConnector } from './xverse-connector';

export class HiroConnector extends XverseConnector {
  id = 'hiro';
  name = 'Hiro Wallet';

  constructor() {
    // Hiro doesn't support WalletConnect
    super();
  }

  async connect(): Promise<any> {
    // Override to disable WalletConnect for Hiro
    const originalConfig = { ...this.config };
    (this as any).config = {}; // Remove WalletConnect config
    const result = await super.connect();
    (this as any).config = originalConfig;
    return result;
  }
}

export default HiroConnector;
