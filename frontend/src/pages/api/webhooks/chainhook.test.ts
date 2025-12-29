import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from './chainhook';

// Mock the realtime services
const mockProcessWebhookPayload = vi.fn();
const mockSaveEvents = vi.fn();
const mockHandleReorg = vi.fn();
const mockBroadcastEvent = vi.fn();

vi.mock('@/lib/realtime/chainhook-socket', () => ({
  getChainhookSocket: () => ({
    processWebhookPayload: mockProcessWebhookPayload,
    broadcastEvent: mockBroadcastEvent,
  }),
}));

vi.mock('@/lib/realtime/event-store', () => ({
  getEventStore: () => ({
    saveEvents: mockSaveEvents,
    handleReorg: mockHandleReorg,
  }),
}));

vi.mock('@/lib/realtime/socket-server', () => ({
  getSocketServer: () => ({}),
}));

describe('Chainhook Webhook Handler', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup response mock
    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({ json: jsonMock }));

    res = {
      status: statusMock as any,
    };

    // Setup environment
    process.env.CHAINHOOK_WEBHOOK_SECRET = 'test-secret-123';

    // Setup default successful responses
    mockProcessWebhookPayload.mockReturnValue([]);
    mockSaveEvents.mockResolvedValue(0);
    mockHandleReorg.mockResolvedValue(0);
  });

  afterEach(() => {
    delete process.env.CHAINHOOK_WEBHOOK_SECRET;
  });

  describe('HTTP Method Validation', () => {
    it('should reject GET requests', async () => {
      req = {
        method: 'GET',
        headers: {},
        body: {},
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Method not allowed',
      });
    });

    it('should reject PUT requests', async () => {
      req = {
        method: 'PUT',
        headers: {},
        body: {},
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
    });

    it('should accept POST requests', async () => {
      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: {
          apply: [],
          rollback: [],
          chainhook: {
            uuid: 'test-uuid',
            predicate: {},
            is_streaming_blocks: true,
          },
        },
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      req = {
        method: 'POST',
        headers: {},
        body: {},
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should reject requests with invalid secret', async () => {
      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer wrong-secret',
        },
        body: {},
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it('should accept requests with valid secret', async () => {
      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: {
          apply: [],
          rollback: [],
          chainhook: {
            uuid: 'test-uuid',
            predicate: {},
            is_streaming_blocks: true,
          },
        },
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe('Apply Events Processing', () => {
    it('should process apply events successfully', async () => {
      const mockPayload = {
        apply: [
          {
            block_identifier: {
              index: 100,
              hash: '0xabc123',
            },
            parent_block_identifier: {
              index: 99,
              hash: '0xabc122',
            },
            timestamp: Date.now(),
            transactions: [
              {
                transaction_identifier: {
                  hash: '0xtx123',
                },
                operations: [],
                metadata: {
                  success: true,
                  sender: 'ST1SENDER',
                  fee: '1000',
                  kind: {},
                  receipt: {},
                  events: [
                    {
                      type: 'print_event',
                      data: {
                        topic: 'exchange-created',
                        value: { 'exchange-id': 1 },
                      },
                    },
                  ],
                  position: {
                    index: 0,
                  },
                },
              },
            ],
            metadata: {},
          },
        ],
        rollback: [],
        chainhook: {
          uuid: 'test-uuid',
          predicate: {},
          is_streaming_blocks: true,
        },
      };

      mockProcessWebhookPayload.mockReturnValue([
        {
          txHash: '0xtx123',
          blockHeight: 100,
          eventType: 'print_event',
          success: true,
        },
      ]);

      mockSaveEvents.mockResolvedValue(1);

      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: mockPayload,
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(mockProcessWebhookPayload).toHaveBeenCalledWith(mockPayload);
      expect(mockSaveEvents).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Webhook processed successfully',
        processed: {
          apply: 1,
          rollback: 0,
        },
      });
    });

    it('should handle multiple blocks in apply', async () => {
      const mockPayload = {
        apply: [
          {
            block_identifier: { index: 100, hash: '0xabc123' },
            parent_block_identifier: { index: 99, hash: '0xabc122' },
            timestamp: Date.now(),
            transactions: [],
            metadata: {},
          },
          {
            block_identifier: { index: 101, hash: '0xabc124' },
            parent_block_identifier: { index: 100, hash: '0xabc123' },
            timestamp: Date.now(),
            transactions: [],
            metadata: {},
          },
        ],
        rollback: [],
        chainhook: {
          uuid: 'test-uuid',
          predicate: {},
          is_streaming_blocks: true,
        },
      };

      mockProcessWebhookPayload.mockReturnValue([]);

      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: mockPayload,
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          processed: {
            apply: 2,
            rollback: 0,
          },
        })
      );
    });

    it('should handle different event types', async () => {
      const mockPayload = {
        apply: [
          {
            block_identifier: { index: 100, hash: '0xabc123' },
            parent_block_identifier: { index: 99, hash: '0xabc122' },
            timestamp: Date.now(),
            transactions: [
              {
                transaction_identifier: { hash: '0xtx123' },
                operations: [],
                metadata: {
                  success: true,
                  sender: 'ST1SENDER',
                  fee: '1000',
                  kind: {},
                  receipt: {},
                  events: [
                    { type: 'stx_transfer_event', data: { amount: '1000' } },
                    { type: 'ft_transfer_event', data: { amount: '500' } },
                    { type: 'nft_transfer_event', data: { value: 'token-1' } },
                  ],
                  position: { index: 0 },
                },
              },
            ],
            metadata: {},
          },
        ],
        rollback: [],
        chainhook: {
          uuid: 'test-uuid',
          predicate: {},
          is_streaming_blocks: true,
        },
      };

      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: mockPayload,
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe('Rollback Events Processing', () => {
    it('should process rollback events successfully', async () => {
      const mockPayload = {
        apply: [],
        rollback: [
          {
            block_identifier: {
              index: 100,
              hash: '0xabc123',
            },
            parent_block_identifier: {
              index: 99,
              hash: '0xabc122',
            },
            timestamp: Date.now(),
            transactions: [],
          },
        ],
        chainhook: {
          uuid: 'test-uuid',
          predicate: {},
          is_streaming_blocks: true,
        },
      };

      mockHandleReorg.mockResolvedValue(5);

      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: mockPayload,
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(mockHandleReorg).toHaveBeenCalledWith([100]);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Webhook processed successfully',
        processed: {
          apply: 0,
          rollback: 1,
        },
      });
    });

    it('should handle multiple blocks in rollback', async () => {
      const mockPayload = {
        apply: [],
        rollback: [
          {
            block_identifier: { index: 100, hash: '0xabc123' },
            parent_block_identifier: { index: 99, hash: '0xabc122' },
            timestamp: Date.now(),
            transactions: [],
          },
          {
            block_identifier: { index: 101, hash: '0xabc124' },
            parent_block_identifier: { index: 100, hash: '0xabc123' },
            timestamp: Date.now(),
            transactions: [],
          },
        ],
        chainhook: {
          uuid: 'test-uuid',
          predicate: {},
          is_streaming_blocks: true,
        },
      };

      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: mockPayload,
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      // Should call handleReorg once for each block
      expect(mockHandleReorg).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors during event processing', async () => {
      mockProcessWebhookPayload.mockImplementation(() => {
        throw new Error('Processing failed');
      });

      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: {
          apply: [
            {
              block_identifier: { index: 100, hash: '0xabc' },
              parent_block_identifier: { index: 99, hash: '0xabc' },
              timestamp: Date.now(),
              transactions: [],
              metadata: {},
            },
          ],
          rollback: [],
          chainhook: { uuid: 'test', predicate: {}, is_streaming_blocks: true },
        },
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Processing failed',
      });
    });

    it('should handle database save errors gracefully', async () => {
      mockSaveEvents.mockRejectedValue(new Error('Database error'));

      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: {
          apply: [],
          rollback: [],
          chainhook: { uuid: 'test', predicate: {}, is_streaming_blocks: true },
        },
      };

      // Should not throw - errors are caught and logged
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('should handle reorg errors gracefully', async () => {
      mockHandleReorg.mockRejectedValue(new Error('Reorg error'));

      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: {
          apply: [],
          rollback: [
            {
              block_identifier: { index: 100, hash: '0xabc' },
              parent_block_identifier: { index: 99, hash: '0xabc' },
              timestamp: Date.now(),
              transactions: [],
            },
          ],
          chainhook: { uuid: 'test', predicate: {}, is_streaming_blocks: true },
        },
      };

      // Should not throw - errors are caught and logged
      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe('Response Format', () => {
    it('should return correct response structure', async () => {
      req = {
        method: 'POST',
        headers: {
          authorization: 'Bearer test-secret-123',
        },
        body: {
          apply: [],
          rollback: [],
          chainhook: { uuid: 'test', predicate: {}, is_streaming_blocks: true },
        },
      };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Webhook processed successfully',
        processed: {
          apply: 0,
          rollback: 0,
        },
      });
    });
  });
});
