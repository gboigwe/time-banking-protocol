/**
 * Leather Wallet Connector for Reown AppKit
 * Supports Leather browser extension and mobile wallet
 */

import { XverseConnector } from './xverse-connector';

export class LeatherConnector extends XverseConnector {
  id = 'leather';
  name = 'Leather';

  constructor(config?: { walletConnectProjectId?: string }) {
    super(config);
  }
}

export default LeatherConnector;
