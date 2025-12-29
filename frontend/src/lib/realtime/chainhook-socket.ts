/**
 * Chainhook WebSocket Server
 * Integrates chainhook webhook events with Socket.io
 */

import { RealtimeSocketServer } from './socket-server';
import { ChainhookPayload, ChainhookEvent } from '@/types/realtime';

export class ChainhookSocketServer {
  private socketServer: RealtimeSocketServer;
  private eventHistory: ChainhookEvent[] = [];
  private maxHistory = 100;

  constructor(socketServer: RealtimeSocketServer) {
    this.socketServer = socketServer;
  }

  /**
   * Process chainhook webhook payload
   */
  public processWebhookPayload(payload: ChainhookPayload): ChainhookEvent[] {
    const events: ChainhookEvent[] = [];

    // Handle apply (new blocks)
    if (payload.apply && payload.apply.length > 0) {
      payload.apply.forEach((block) => {
        block.transactions.forEach((tx) => {
          if (tx.metadata.success && tx.metadata.receipt.events) {
            tx.metadata.receipt.events.forEach((event) => {
              const chainhookEvent = this.convertToChainhookEvent(
                tx,
                event,
                block
              );
              events.push(chainhookEvent);

              // Store in history
              this.addToHistory(chainhookEvent);

              // Broadcast to connected clients
              this.socketServer.broadcastEvent(chainhookEvent);
            });
          }
        });
      });
    }

    // Handle rollback (chain reorganization)
    if (payload.rollback && payload.rollback.length > 0) {
      this.handleReorg(payload.rollback);
    }

    return events;
  }

  /**
   * Convert raw event to ChainhookEvent
   */
  private convertToChainhookEvent(
    tx: any,
    event: any,
    block: any
  ): ChainhookEvent {
    // Extract contract ID from contract calls stack
    let contractId = 'unknown';
    let affectedAddresses: string[] = [tx.metadata.sender];

    if (tx.metadata.contract_calls_stack && tx.metadata.contract_calls_stack.length > 0) {
      contractId = tx.metadata.contract_calls_stack[0].contract_identifier;
    }

    // Extract affected addresses from event data
    if (event.data) {
      if (event.data.sender) affectedAddresses.push(event.data.sender);
      if (event.data.receiver) affectedAddresses.push(event.data.receiver);
      if (event.data.provider) affectedAddresses.push(event.data.provider);
      if (event.data.beneficiary) affectedAddresses.push(event.data.beneficiary);
    }

    // Remove duplicates
    affectedAddresses = [...new Set(affectedAddresses)];

    return {
      txHash: tx.transaction_identifier.hash,
      blockHeight: block.block_identifier.index,
      blockHash: block.block_identifier.hash,
      contractId,
      eventType: event.type,
      eventTopic: event.data?.event || event.data?.topic,
      value: event.data,
      affectedAddresses,
      success: tx.metadata.success,
      timestamp: block.timestamp || Date.now(),
      metadata: {
        sender: tx.metadata.sender,
        functionName: tx.metadata.contract_calls_stack?.[0]?.function_name,
      },
    };
  }

  /**
   * Handle chain reorganization
   */
  private handleReorg(rollbackBlocks: Array<{ block_identifier: { index: number; hash: string } }>): void {
    const rollbackHeights = rollbackBlocks.map((b) => b.block_identifier.index);

    // Remove events from history
    this.eventHistory = this.eventHistory.filter(
      (event) => !rollbackHeights.includes(event.blockHeight)
    );

    // Broadcast reorg notification
    this.socketServer.broadcastStatus({
      type: 'reorg',
      message: `Chain reorganization detected, rolled back blocks: ${rollbackHeights.join(', ')}`,
      timestamp: Date.now(),
    });

    console.warn(`[Chainhook] Handled reorg for blocks: ${rollbackHeights.join(', ')}`);
  }

  /**
   * Add event to history
   */
  private addToHistory(event: ChainhookEvent): void {
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.pop();
    }
  }

  /**
   * Get recent events
   */
  public getRecentEvents(limit = 50): ChainhookEvent[] {
    return this.eventHistory.slice(0, limit);
  }

  /**
   * Get events by contract
   */
  public getEventsByContract(contractId: string, limit = 50): ChainhookEvent[] {
    return this.eventHistory
      .filter((event) => event.contractId === contractId)
      .slice(0, limit);
  }

  /**
   * Get events by user address
   */
  public getEventsByUser(address: string, limit = 50): ChainhookEvent[] {
    return this.eventHistory
      .filter((event) => event.affectedAddresses.includes(address))
      .slice(0, limit);
  }

  /**
   * Get events by type
   */
  public getEventsByType(eventType: string, limit = 50): ChainhookEvent[] {
    return this.eventHistory
      .filter((event) => event.eventType === eventType)
      .slice(0, limit);
  }

  /**
   * Clear event history
   */
  public clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      totalEvents: this.eventHistory.length,
      uniqueContracts: new Set(this.eventHistory.map((e) => e.contractId)).size,
      uniqueAddresses: new Set(
        this.eventHistory.flatMap((e) => e.affectedAddresses)
      ).size,
      eventTypes: new Set(this.eventHistory.map((e) => e.eventType)).size,
      oldestEvent: this.eventHistory[this.eventHistory.length - 1]?.timestamp,
      newestEvent: this.eventHistory[0]?.timestamp,
    };
  }
}

// Singleton instance
let chainhookSocket: ChainhookSocketServer | null = null;

/**
 * Initialize Chainhook Socket Server
 */
export function initChainhookSocket(socketServer: RealtimeSocketServer): ChainhookSocketServer {
  if (!chainhookSocket) {
    chainhookSocket = new ChainhookSocketServer(socketServer);
    console.log('[Chainhook] Socket server initialized');
  }
  return chainhookSocket;
}

/**
 * Get Chainhook Socket Server instance
 */
export function getChainhookSocket(): ChainhookSocketServer | null {
  return chainhookSocket;
}
