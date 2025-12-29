/**
 * WebSocket Server Infrastructure for Real-Time Events
 * Socket.io server with subscription management
 */

import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { ChainhookEvent, Subscription } from '@/types/realtime';

export class RealtimeSocketServer {
  private io: SocketIOServer;
  private subscriptions: Map<string, Set<string>> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || '*',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.setupHandlers();
  }

  /**
   * Setup Socket.io event handlers
   */
  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`[Socket.io] Client connected: ${socket.id}`);

      // Handle contract subscription
      socket.on('subscribe:contract', (contractId: string) => {
        const room = `contract:${contractId}`;
        socket.join(room);
        this.addSubscription(socket.id, room);
        console.log(`[Socket.io] ${socket.id} subscribed to ${room}`);
        socket.emit('subscription:success', { type: 'contract', id: contractId });
      });

      // Handle user address subscription
      socket.on('subscribe:user', (address: string) => {
        const room = `user:${address}`;
        socket.join(room);
        this.addSubscription(socket.id, room);
        console.log(`[Socket.io] ${socket.id} subscribed to ${room}`);
        socket.emit('subscription:success', { type: 'user', address });
      });

      // Handle event type subscription
      socket.on('subscribe:event-type', (eventType: string) => {
        const room = `event-type:${eventType}`;
        socket.join(room);
        this.addSubscription(socket.id, room);
        console.log(`[Socket.io] ${socket.id} subscribed to ${room}`);
        socket.emit('subscription:success', { type: 'event-type', eventType });
      });

      // Handle unsubscribe
      socket.on('unsubscribe', (room: string) => {
        socket.leave(room);
        this.removeSubscription(socket.id, room);
        console.log(`[Socket.io] ${socket.id} unsubscribed from ${room}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`[Socket.io] Client disconnected: ${socket.id}`);
        this.cleanupSubscriptions(socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`[Socket.io] Socket error for ${socket.id}:`, error);
      });
    });
  }

  /**
   * Broadcast chainhook event to subscribers
   */
  public broadcastEvent(event: ChainhookEvent): void {
    // Broadcast to contract subscribers
    this.io.to(`contract:${event.contractId}`).emit('chainhook:event', event);

    // Broadcast to affected users
    if (event.affectedAddresses && event.affectedAddresses.length > 0) {
      event.affectedAddresses.forEach((address) => {
        this.io.to(`user:${address}`).emit('chainhook:event', event);
      });
    }

    // Broadcast to event type subscribers
    if (event.eventType) {
      this.io.to(`event-type:${event.eventType}`).emit('chainhook:event', event);
    }

    // Broadcast to global listeners
    this.io.emit('chainhook:event:global', event);
  }

  /**
   * Broadcast system status update
   */
  public broadcastStatus(status: { type: string; message: string; timestamp: number }): void {
    this.io.emit('system:status', status);
  }

  /**
   * Add subscription tracking
   */
  private addSubscription(socketId: string, room: string): void {
    if (!this.subscriptions.has(socketId)) {
      this.subscriptions.set(socketId, new Set());
    }
    this.subscriptions.get(socketId)!.add(room);
  }

  /**
   * Remove subscription tracking
   */
  private removeSubscription(socketId: string, room: string): void {
    const rooms = this.subscriptions.get(socketId);
    if (rooms) {
      rooms.delete(room);
      if (rooms.size === 0) {
        this.subscriptions.delete(socketId);
      }
    }
  }

  /**
   * Cleanup subscriptions on disconnect
   */
  private cleanupSubscriptions(socketId: string): void {
    this.subscriptions.delete(socketId);
  }

  /**
   * Get active connections count
   */
  public getConnectionCount(): number {
    return this.io.sockets.sockets.size;
  }

  /**
   * Get subscriptions count
   */
  public getSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Get server instance
   */
  public getServer(): SocketIOServer {
    return this.io;
  }
}

// Singleton instance
let socketServer: RealtimeSocketServer | null = null;

/**
 * Initialize Socket.io server
 */
export function initSocketServer(httpServer: HTTPServer): RealtimeSocketServer {
  if (!socketServer) {
    socketServer = new RealtimeSocketServer(httpServer);
    console.log('[Socket.io] Server initialized');
  }
  return socketServer;
}

/**
 * Get Socket.io server instance
 */
export function getSocketServer(): RealtimeSocketServer | null {
  return socketServer;
}
