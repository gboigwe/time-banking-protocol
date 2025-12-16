import type { NextApiRequest, NextApiResponse } from 'next';

// Chainhook webhook payload types
interface ChainhookPayload {
  apply: ApplyBlock[];
  rollback: RollbackBlock[];
  chainhook: {
    uuid: string;
    predicate: any;
    is_streaming_blocks: boolean;
  };
}

interface ApplyBlock {
  block_identifier: {
    index: number;
    hash: string;
  };
  parent_block_identifier: {
    index: number;
    hash: string;
  };
  timestamp: number;
  transactions: Transaction[];
  metadata: any;
}

interface RollbackBlock {
  block_identifier: {
    index: number;
    hash: string;
  };
  parent_block_identifier: {
    index: number;
    hash: string;
  };
  timestamp: number;
  transactions: Transaction[];
}

interface Transaction {
  transaction_identifier: {
    hash: string;
  };
  operations: any[];
  metadata: {
    success: boolean;
    result?: string;
    sender: string;
    fee: string;
    kind: any;
    receipt: any;
    events: ContractEvent[];
    position: {
      index: number;
    };
  };
}

interface ContractEvent {
  type: string;
  data: any;
}

// Event storage (in-memory for now, replace with DB in production)
const recentEvents: any[] = [];
const MAX_EVENTS = 100;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook secret
    const authHeader = req.headers.authorization;
    const expectedAuth = `Bearer ${process.env.CHAINHOOK_WEBHOOK_SECRET}`;

    if (authHeader !== expectedAuth) {
      console.error('Unauthorized webhook request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload: ChainhookPayload = req.body;

    // Log received webhook
    console.log('\n========== CHAINHOOK WEBHOOK RECEIVED ==========');
    console.log('Chainhook UUID:', payload.chainhook.uuid);
    console.log('Timestamp:', new Date().toISOString());

    // Process apply events (new blocks/transactions)
    if (payload.apply && payload.apply.length > 0) {
      console.log(`\n📥 APPLY: ${payload.apply.length} block(s)`);

      for (const block of payload.apply) {
        console.log(`\nBlock #${block.block_identifier.index}`);
        console.log(`  Hash: ${block.block_identifier.hash.substring(0, 16)}...`);
        console.log(`  Transactions: ${block.transactions.length}`);

        for (const tx of block.transactions) {
          const txHash = tx.transaction_identifier.hash;
          const success = tx.metadata.success;
          const sender = tx.metadata.sender;

          console.log(`\n  📄 Transaction: ${txHash.substring(0, 16)}...`);
          console.log(`     Sender: ${sender}`);
          console.log(`     Success: ${success}`);
          console.log(`     Events: ${tx.metadata.events.length}`);

          // Process contract events
          if (tx.metadata.events && tx.metadata.events.length > 0) {
            for (const event of tx.metadata.events) {
              console.log(`     🔔 Event Type: ${event.type}`);

              // Extract meaningful event data based on type
              let eventData: any = {
                type: event.type,
                txHash,
                sender,
                blockHeight: block.block_identifier.index,
                timestamp: block.timestamp,
                success,
              };

              // Parse different event types
              if (event.type === 'print_event') {
                eventData.topic = event.data?.topic || event.data?.raw?.value?.value?.topic?.value;
                eventData.value = event.data?.value || event.data?.raw?.value?.value?.value;
                console.log(`        Topic: ${eventData.topic}`);
              } else if (event.type === 'stx_transfer_event') {
                eventData.amount = event.data?.amount;
                eventData.recipient = event.data?.recipient;
                console.log(`        Amount: ${eventData.amount}`);
                console.log(`        Recipient: ${eventData.recipient}`);
              } else if (event.type === 'ft_transfer_event') {
                eventData.asset = event.data?.asset_identifier;
                eventData.amount = event.data?.amount;
                eventData.recipient = event.data?.recipient;
                console.log(`        Asset: ${eventData.asset}`);
                console.log(`        Amount: ${eventData.amount}`);
              } else if (event.type === 'nft_transfer_event') {
                eventData.asset = event.data?.asset_identifier;
                eventData.value = event.data?.value;
                eventData.recipient = event.data?.recipient;
                console.log(`        Asset: ${eventData.asset}`);
              }

              // Store event in memory
              recentEvents.unshift({
                ...eventData,
                receivedAt: Date.now(),
              });

              // Keep only recent events
              if (recentEvents.length > MAX_EVENTS) {
                recentEvents.pop();
              }
            }
          }
        }
      }
    }

    // Process rollback events (blockchain reorganization)
    if (payload.rollback && payload.rollback.length > 0) {
      console.log(`\n⚠️  ROLLBACK: ${payload.rollback.length} block(s)`);

      for (const block of payload.rollback) {
        console.log(`\nRolling back Block #${block.block_identifier.index}`);
        console.log(`  Hash: ${block.block_identifier.hash.substring(0, 16)}...`);

        // Remove rolled-back events from memory
        const blockHeight = block.block_identifier.index;
        const beforeCount = recentEvents.length;

        // Filter out events from rolled-back blocks
        const filteredEvents = recentEvents.filter(
          event => event.blockHeight !== blockHeight
        );

        const removedCount = beforeCount - filteredEvents.length;
        if (removedCount > 0) {
          console.log(`  🗑️  Removed ${removedCount} event(s) from rolled-back block`);
          recentEvents.length = 0;
          recentEvents.push(...filteredEvents);
        }
      }
    }

    console.log('\n===============================================\n');

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      processed: {
        apply: payload.apply?.length || 0,
        rollback: payload.rollback?.length || 0,
      },
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Export function to get recent events (for frontend polling or SSE)
export function getRecentEvents(limit: number = 50) {
  return recentEvents.slice(0, limit);
}
