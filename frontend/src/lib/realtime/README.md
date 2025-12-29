# Real-Time Synchronization Engine

Complete real-time state synchronization system for Time Banking Protocol using WebSockets, optimistic updates, and offline support.

## Features

- **WebSocket Communication**: Bi-directional real-time event streaming
- **Optimistic Updates**: Instant UI feedback with automatic rollback
- **Offline Queue**: Queues operations when offline, syncs when back online
- **Event Store**: PostgreSQL persistence for all blockchain events
- **Conflict Resolution**: Smart merge strategies for state conflicts
- **Subscription Management**: Flexible event filtering and routing

## Quick Start

### Server-Side Setup

```typescript
import { initSocketServer, initChainhookSocket } from '@/lib/realtime';

// Initialize Socket.io server
const httpServer = createServer(app);
const socketServer = initSocketServer(httpServer);

// Initialize Chainhook integration
const chainhookSocket = initChainhookSocket(socketServer);
```

### Client-Side Usage

```typescript
import { useRealtimeEvents } from '@/hooks/useRealtimeEvents';

function MyComponent() {
  const { events, isConnected } = useRealtimeEvents({
    subscriptions: [
      { type: 'contract', contractId: 'ST1...timebank-foundation' },
      { type: 'user', address: userAddress },
    ],
  });

  return (
    <div>
      {isConnected && <p>Connected to realtime updates!</p>}
      {events.map((event) => (
        <EventCard key={event.txHash} event={event} />
      ))}
    </div>
  );
}
```

### Optimistic Updates

```typescript
import { getOptimisticStateManager } from '@/lib/realtime';

const optimistic = getOptimisticStateManager();

await optimistic.executeWithOptimistic(
  'create-exchange',
  { id: 123, status: 'pending' },
  async () => {
    return await createExchange(data);
  },
  (data) => console.log('Confirmed!', data),
  () => console.log('Reverted!')
);
```

### Offline Support

```typescript
import { useOfflineSync } from '@/hooks/useOfflineSync';

function App() {
  const { isOnline, queuedItems, enqueue } = useOfflineSync();

  const handleAction = async () => {
    if (!isOnline) {
      await enqueue('transaction', txData);
      return;
    }
    // Process immediately
  };
}
```

## Architecture

### Server Components

- **Socket Server** (`socket-server.ts`): Core WebSocket infrastructure
- **Chainhook Socket** (`chainhook-socket.ts`): Processes blockchain events
- **Event Store** (`event-store.ts`): PostgreSQL persistence layer
- **Subscription Manager** (`subscription-manager.ts`): Event routing

### Client Components

- **Socket Client** (`socket-client.ts`): WebSocket client for React
- **Optimistic State** (`optimistic-state.ts`): UI update manager
- **Offline Queue** (`offline-queue.ts`): Background sync system
- **Conflict Resolver** (`conflict-resolver.ts`): State merge logic

### React Hooks

- **useRealtimeEvents**: Subscribe to blockchain events
- **useContractEvents**: Contract-specific events
- **useUserEvents**: User address events
- **useOfflineSync**: Offline queue management

## Database Schema

```sql
CREATE TABLE chainhook_events (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  block_height BIGINT NOT NULL,
  contract_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB NOT NULL,
  affected_addresses TEXT[] NOT NULL,
  success BOOLEAN NOT NULL,
  timestamp BIGINT NOT NULL
);
```

## Configuration

Environment variables:

```env
DATABASE_URL=postgresql://localhost:5432/timebank
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
CHAINHOOK_WEBHOOK_SECRET=your_secret_here
```

## Event Types

- `contract`: Filter by smart contract
- `user`: Filter by user address
- `event-type`: Filter by event type (print_event, stx_transfer_event, etc.)

## Best Practices

1. **Always use optimistic updates** for better UX
2. **Handle offline scenarios** gracefully
3. **Subscribe only to needed events** to reduce overhead
4. **Implement conflict resolution** for multi-device scenarios
5. **Monitor connection status** and show user feedback

## Performance

- WebSocket reconnection with exponential backoff
- Event batching for database writes
- IndexedDB for client-side offline storage
- Connection pooling for PostgreSQL

## Testing

```bash
# Run unit tests
npm test src/lib/realtime

# Test WebSocket connection
curl -X POST http://localhost:3000/api/webhooks/chainhook
```

## License

MIT
