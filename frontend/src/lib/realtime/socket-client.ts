/**
 * Socket.io Client for React
 * Manages WebSocket connection and event subscriptions
 */

import { io, Socket } from 'socket.io-client';
import { ChainhookEvent, ConnectionStatus, Subscription } from '@/types/realtime';

export type EventHandler = (event: ChainhookEvent) => void;
export type StatusHandler = (status: ConnectionStatus) => void;
export type ErrorHandler = (error: Error) => void;

export class SocketClient {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private statusHandlers: Set<StatusHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private status: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to Socket.io server
   */
  public connect(url?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const serverUrl = url || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      // Connection successful
      this.socket.on('connect', () => {
        console.log('[Socket.io] Connected to server');
        this.updateStatus(ConnectionStatus.CONNECTED);
        this.reconnectAttempts = 0;
        resolve();
      });

      // Connection error
      this.socket.on('connect_error', (error) => {
        console.error('[Socket.io] Connection error:', error);
        this.updateStatus(ConnectionStatus.ERROR);
        this.notifyError(error);
        reject(error);
      });

      // Disconnected
      this.socket.on('disconnect', (reason) => {
        console.log('[Socket.io] Disconnected:', reason);
        this.updateStatus(ConnectionStatus.DISCONNECTED);

        if (reason === 'io server disconnect') {
          // Server initiated disconnect, reconnect manually
          this.socket?.connect();
        }
      });

      // Reconnecting
      this.socket.on('reconnect_attempt', () => {
        this.reconnectAttempts++;
        console.log(`[Socket.io] Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.updateStatus(ConnectionStatus.RECONNECTING);
      });

      // Reconnection successful
      this.socket.on('reconnect', () => {
        console.log('[Socket.io] Reconnected successfully');
        this.updateStatus(ConnectionStatus.CONNECTED);
        this.reconnectAttempts = 0;
      });

      // Reconnection failed
      this.socket.on('reconnect_failed', () => {
        console.error('[Socket.io] Reconnection failed');
        this.updateStatus(ConnectionStatus.ERROR);
        this.notifyError(new Error('Failed to reconnect after maximum attempts'));
      });

      // Handle chainhook events
      this.socket.on('chainhook:event', (event: ChainhookEvent) => {
        this.handleEvent(event);
      });

      // Handle global events
      this.socket.on('chainhook:event:global', (event: ChainhookEvent) => {
        this.handleEvent(event, 'global');
      });

      // Handle subscription success
      this.socket.on('subscription:success', (data: any) => {
        console.log('[Socket.io] Subscription successful:', data);
      });

      // Handle system status
      this.socket.on('system:status', (status: any) => {
        console.log('[Socket.io] System status:', status);
      });
    });
  }

  /**
   * Disconnect from server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.updateStatus(ConnectionStatus.DISCONNECTED);
    }
  }

  /**
   * Subscribe to contract events
   */
  public subscribeToContract(contractId: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('subscribe:contract', contractId);
  }

  /**
   * Subscribe to user address events
   */
  public subscribeToUser(address: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('subscribe:user', address);
  }

  /**
   * Subscribe to event type
   */
  public subscribeToEventType(eventType: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('subscribe:event-type', eventType);
  }

  /**
   * Unsubscribe from room
   */
  public unsubscribe(room: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('unsubscribe', room);
  }

  /**
   * Add event handler
   */
  public onEvent(handler: EventHandler, channel = 'default'): () => void {
    if (!this.eventHandlers.has(channel)) {
      this.eventHandlers.set(channel, new Set());
    }
    this.eventHandlers.get(channel)!.add(handler);

    // Return cleanup function
    return () => {
      this.eventHandlers.get(channel)?.delete(handler);
    };
  }

  /**
   * Add status change handler
   */
  public onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  /**
   * Add error handler
   */
  public onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  /**
   * Handle incoming event
   */
  private handleEvent(event: ChainhookEvent, channel = 'default'): void {
    const handlers = this.eventHandlers.get(channel);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error('[Socket.io] Error in event handler:', error);
        }
      });
    }
  }

  /**
   * Update connection status
   */
  private updateStatus(status: ConnectionStatus): void {
    this.status = status;
    this.statusHandlers.forEach((handler) => {
      try {
        handler(status);
      } catch (error) {
        console.error('[Socket.io] Error in status handler:', error);
      }
    });
  }

  /**
   * Notify error
   */
  private notifyError(error: Error): void {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (err) {
        console.error('[Socket.io] Error in error handler:', err);
      }
    });
  }

  /**
   * Get current connection status
   */
  public getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.status === ConnectionStatus.CONNECTED && this.socket?.connected === true;
  }

  /**
   * Get socket instance
   */
  public getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
let socketClient: SocketClient | null = null;

/**
 * Get or create socket client instance
 */
export function getSocketClient(): SocketClient {
  if (!socketClient) {
    socketClient = new SocketClient();
  }
  return socketClient;
}
