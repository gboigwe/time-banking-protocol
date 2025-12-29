/**
 * PostgreSQL Event Store
 * Persistent storage for chainhook events
 */

import { Pool, PoolClient } from 'pg';
import { ChainhookEvent } from '@/types/realtime';

export class EventStore {
  private pool: Pool;

  constructor(connectionString?: string) {
    this.pool = new Pool({
      connectionString:
        connectionString ||
        process.env.DATABASE_URL ||
        'postgresql://localhost:5432/timebank',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  /**
   * Save event to database
   */
  public async saveEvent(event: ChainhookEvent): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        `INSERT INTO chainhook_events
         (tx_hash, block_height, block_hash, contract_id, event_type,
          event_topic, event_data, affected_addresses, success, timestamp, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (tx_hash) DO NOTHING`,
        [
          event.txHash,
          event.blockHeight,
          event.blockHash,
          event.contractId,
          event.eventType,
          event.eventTopic || null,
          JSON.stringify(event.value),
          event.affectedAddresses,
          event.success,
          event.timestamp,
          JSON.stringify(event.metadata || {}),
        ]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Save multiple events in batch
   */
  public async saveEvents(events: ChainhookEvent[]): Promise<number> {
    const client = await this.pool.connect();
    let saved = 0;

    try {
      await client.query('BEGIN');

      for (const event of events) {
        const result = await client.query(
          `INSERT INTO chainhook_events
           (tx_hash, block_height, block_hash, contract_id, event_type,
            event_topic, event_data, affected_addresses, success, timestamp, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (tx_hash) DO NOTHING
           RETURNING id`,
          [
            event.txHash,
            event.blockHeight,
            event.blockHash,
            event.contractId,
            event.eventType,
            event.eventTopic || null,
            JSON.stringify(event.value),
            event.affectedAddresses,
            event.success,
            event.timestamp,
            JSON.stringify(event.metadata || {}),
          ]
        );

        if (result.rowCount && result.rowCount > 0) {
          saved++;
        }
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return saved;
  }

  /**
   * Get recent events
   */
  public async getRecentEvents(limit = 50): Promise<ChainhookEvent[]> {
    const result = await this.pool.query(
      `SELECT * FROM chainhook_events
       ORDER BY block_height DESC, timestamp DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(this.rowToEvent);
  }

  /**
   * Get events by contract
   */
  public async getEventsByContract(
    contractId: string,
    limit = 50
  ): Promise<ChainhookEvent[]> {
    const result = await this.pool.query(
      `SELECT * FROM chainhook_events
       WHERE contract_id = $1
       ORDER BY block_height DESC, timestamp DESC
       LIMIT $2`,
      [contractId, limit]
    );

    return result.rows.map(this.rowToEvent);
  }

  /**
   * Get events by user address
   */
  public async getEventsByUser(
    address: string,
    limit = 50
  ): Promise<ChainhookEvent[]> {
    const result = await this.pool.query(
      `SELECT * FROM chainhook_events
       WHERE $1 = ANY(affected_addresses)
       ORDER BY block_height DESC, timestamp DESC
       LIMIT $2`,
      [address, limit]
    );

    return result.rows.map(this.rowToEvent);
  }

  /**
   * Get events by type
   */
  public async getEventsByType(
    eventType: string,
    limit = 50
  ): Promise<ChainhookEvent[]> {
    const result = await this.pool.query(
      `SELECT * FROM chainhook_events
       WHERE event_type = $1
       ORDER BY block_height DESC, timestamp DESC
       LIMIT $2`,
      [eventType, limit]
    );

    return result.rows.map(this.rowToEvent);
  }

  /**
   * Get events in block height range
   */
  public async getEventsByBlockRange(
    startBlock: number,
    endBlock: number
  ): Promise<ChainhookEvent[]> {
    const result = await this.pool.query(
      `SELECT * FROM chainhook_events
       WHERE block_height BETWEEN $1 AND $2
       ORDER BY block_height ASC, timestamp ASC`,
      [startBlock, endBlock]
    );

    return result.rows.map(this.rowToEvent);
  }

  /**
   * Handle chain reorganization
   */
  public async handleReorg(rollbackBlocks: number[]): Promise<number> {
    const result = await this.pool.query(
      `DELETE FROM chainhook_events
       WHERE block_height = ANY($1)
       RETURNING id`,
      [rollbackBlocks]
    );

    return result.rowCount || 0;
  }

  /**
   * Get event statistics
   */
  public async getStats() {
    const result = await this.pool.query(`
      SELECT
        COUNT(*) as total_events,
        COUNT(DISTINCT contract_id) as unique_contracts,
        COUNT(DISTINCT unnest(affected_addresses)) as unique_addresses,
        COUNT(DISTINCT event_type) as unique_event_types,
        MIN(timestamp) as oldest_event,
        MAX(timestamp) as newest_event,
        MAX(block_height) as highest_block
      FROM chainhook_events
    `);

    return result.rows[0];
  }

  /**
   * Clean old events (older than retention period)
   */
  public async cleanOldEvents(retentionDays = 30): Promise<number> {
    const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

    const result = await this.pool.query(
      `DELETE FROM chainhook_events
       WHERE timestamp < $1
       RETURNING id`,
      [cutoffTime]
    );

    return result.rowCount || 0;
  }

  /**
   * Convert database row to ChainhookEvent
   */
  private rowToEvent(row: any): ChainhookEvent {
    return {
      txHash: row.tx_hash,
      blockHeight: parseInt(row.block_height),
      blockHash: row.block_hash,
      contractId: row.contract_id,
      eventType: row.event_type,
      eventTopic: row.event_topic,
      value: typeof row.event_data === 'string'
        ? JSON.parse(row.event_data)
        : row.event_data,
      affectedAddresses: row.affected_addresses,
      success: row.success,
      timestamp: parseInt(row.timestamp),
      metadata: typeof row.metadata === 'string'
        ? JSON.parse(row.metadata)
        : row.metadata,
    };
  }

  /**
   * Close database connection
   */
  public async close(): Promise<void> {
    await this.pool.end();
  }

  /**
   * Test database connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.pool.query('SELECT NOW()');
      return !!result;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
let eventStore: EventStore | null = null;

/**
 * Get or create event store instance
 */
export function getEventStore(): EventStore {
  if (!eventStore) {
    eventStore = new EventStore();
  }
  return eventStore;
}
