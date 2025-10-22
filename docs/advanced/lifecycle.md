---
sidebar_position: 3
title: Lifecycle
description: Complete client lifecycle management guide
---

# ⚙️ Client Lifecycle

Understanding XHub Chat client lifecycle - from initialization to shutdown.

## Overview

The XHub Chat client goes through several phases during its lifetime:

```
┌─────────────┐
│   Created   │ ← new XHubChatClient(config)
└──────┬──────┘
       │
       │ startClient()
       ▼
┌─────────────┐
│  Starting   │ ← Loading cache, connecting
└──────┬──────┘
       │
       │ Sync begins
       ▼
┌─────────────┐
│  Prepared   │ ← Ready to use
└──────┬──────┘
       │
       │ Syncing
       ▼
┌─────────────┐
│   Syncing   │ ← Receiving updates
└──────┬──────┘
       │
       │ stopClient()
       ▼
┌─────────────┐
│   Stopped   │ ← Sync stopped, data saved
└──────┬──────┘
       │
       │ destroy()
       ▼
┌─────────────┐
│  Destroyed  │ ← Resources released
└─────────────┘
```

## Lifecycle Phases

### 1. Creation

**What happens:**
- Client instance is created
- Configuration is validated
- Store is initialized (but not started)
- HTTP API is configured
- Event emitter is set up

**Code:**

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-token',
  userId: '@user:example.com',
  store: {
    type: 'indexeddb',
    dbName: 'xhub-chat',
  },
});

// Client state: Created
// No network activity yet
// No data loaded
```

**State:**
- `client.clientRunning`: `false`
- `client.syncState`: `SyncState.Stopped`
- Store: Not connected
- Events: Can be registered

### 2. Starting

**What happens:**
- Store connects to database
- Cached data is loaded (if available)
- Sync preparation begins
- Initial sync request is sent

**Code:**

```typescript
await client.startClient({
  initialSyncLimit: 20, // Load last 20 messages per room
});

// Client state: Starting → Prepared
```

**Internal Flow:**

```typescript
export class XHubChatClient {
  public async startClient(opts?: IStartClientOpts): Promise<void> {
    try {
      // 1. Mark as running
      this.clientRunning = true;
      this.emit(ClientEvent.Sync, SyncState.Preparing);
      
      // 2. Start store (connect to IndexedDB)
      await this.store.startup();
      
      // 3. Load cached rooms
      const cachedRooms = await this.store.getSavedRooms();
      if (cachedRooms) {
        for (const roomData of cachedRooms) {
          const room = this.createRoom(roomData.roomId);
          room.deserialize(roomData);
          this.store.storeRoom(room);
        }
      }
      
      // 4. Start sync
      await this.syncApi.sync(opts);
      
      // 5. Mark as prepared
      this.emit(ClientEvent.Sync, SyncState.Prepared);
      
    } catch (error) {
      this.emit(ClientEvent.Sync, SyncState.Error, error);
      throw error;
    }
  }
}
```

**Events Emitted:**

```typescript
// Listen for lifecycle events
client.on(ClientEvent.Sync, (state, prevState) => {
  console.log(`Sync state: ${prevState} → ${state}`);
});

// Events during startup:
// 1. "sync" with SyncState.Preparing
// 2. "sync" with SyncState.Prepared
```

### 3. Prepared

**What happens:**
- Initial sync completed
- Cached data loaded
- Client ready for use
- Sync loop not yet started

**When to use:**
- Perfect time to initialize UI
- Rooms are available
- Can send messages
- Timeline may be partial

**Code:**

```typescript
client.once(ClientEvent.Sync, (state) => {
  if (state === SyncState.Prepared) {
    console.log('Client is ready!');
    
    // Safe to access rooms
    const rooms = client.getRooms();
    console.log(`Found ${rooms.length} rooms`);
    
    // Can send messages
    client.sendTextMessage(roomId, 'Hello!');
  }
});
```

### 4. Syncing

**What happens:**
- Continuous sync loop running
- Receiving new events in real-time
- Timeline updates
- Presence updates
- Typing indicators

**Code:**

```typescript
client.on(ClientEvent.Sync, (state) => {
  if (state === SyncState.Syncing) {
    console.log('Receiving updates...');
  }
});

// Listen for new messages
client.on(ClientEvent.RoomTimeline, (event, room) => {
  if (event.getType() === 'm.room.message') {
    console.log(`New message in ${room?.name}: ${event.getContent().body}`);
  }
});
```

**Sync Loop:**

```typescript
export class SyncApi {
  public async sync(opts?: IStartClientOpts): Promise<void> {
    while (this.shouldSync()) {
      try {
        // 1. Send sync request
        const response = await this.client.http.authedRequest(
          Method.Get,
          '/sync',
          {
            timeout: 30000,
            since: this.client.store.getSyncToken(),
          }
        );
        
        // 2. Emit syncing state
        this.client.emit(ClientEvent.Sync, SyncState.Syncing);
        
        // 3. Process response
        await this.processSyncResponse(response);
        
        // 4. Update token
        this.client.store.setSyncToken(response.next_batch);
        
        // 5. Save to database
        await this.client.store.save();
        
        // 6. Continue loop
        
      } catch (error) {
        await this.handleSyncError(error);
      }
    }
  }
}
```

### 5. Stopping

**What happens:**
- Sync loop is terminated
- Pending changes are saved
- Network requests are cancelled
- No new events processed

**Code:**

```typescript
// Stop the client
await client.stopClient();

// Client state: Stopped
// Data is preserved
// Can restart with startClient()
```

**Internal Flow:**

```typescript
export class XHubChatClient {
  public async stopClient(): Promise<void> {
    // 1. Stop sync loop
    this.syncApi.stop();
    this.clientRunning = false;
    
    // 2. Save pending data
    await this.store.save(true); // force save
    
    // 3. Emit stopped state
    this.emit(ClientEvent.Sync, SyncState.Stopped);
  }
}
```

### 6. Destroyed

**What happens:**
- All resources released
- Database connections closed
- Event listeners removed
- Cannot be restarted

**Code:**

```typescript
// Destroy the client (permanent)
await client.destroy();

// Client state: Destroyed
// Cannot be reused
// Create new instance if needed
```

**Internal Flow:**

```typescript
export class XHubChatClient {
  public async destroy(): Promise<void> {
    // 1. Stop client if running
    if (this.clientRunning) {
      await this.stopClient();
    }
    
    // 2. Destroy store
    await this.store.destroy();
    
    // 3. Remove all listeners
    this.removeAllListeners();
    
    // 4. Clear references
    this.store = null!;
    this.syncApi = null!;
    this.http = null!;
  }
}
```

## React Integration

### Provider Lifecycle

```tsx
import React, { useEffect, useRef } from 'react';
import { createClient, XHubChatClient } from '@xhub-chat/core';

export function XHubChatProvider({ config, children }) {
  const clientRef = useRef<XHubChatClient | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Create client
    const client = createClient(config);
    clientRef.current = client;

    // 2. Listen for ready state
    const onSync = (state: SyncState) => {
      if (state === SyncState.Prepared) {
        setIsReady(true);
      }
    };
    client.on(ClientEvent.Sync, onSync);

    // 3. Start client
    client.startClient().catch(console.error);

    // 4. Cleanup on unmount
    return () => {
      client.off(ClientEvent.Sync, onSync);
      client.stopClient().then(() => {
        client.destroy();
      });
    };
  }, [config]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <XHubChatContext.Provider value={clientRef.current}>
      {children}
    </XHubChatContext.Provider>
  );
}
```

### Hook Lifecycle

```tsx
export function useRoom(roomId: string) {
  const client = useXHubChat();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    // Get initial room
    const initialRoom = client.getRoom(roomId);
    setRoom(initialRoom);

    // Listen for updates
    const onRoom = (updatedRoom: Room) => {
      if (updatedRoom.roomId === roomId) {
        setRoom(updatedRoom);
      }
    };

    client.on(ClientEvent.Room, onRoom);

    return () => {
      client.off(ClientEvent.Room, onRoom);
    };
  }, [client, roomId]);

  return room;
}
```

## Error Handling

### Sync Errors

```typescript
client.on(ClientEvent.Sync, (state, prevState, data) => {
  if (state === SyncState.Error) {
    const error = data as Error;
    
    if (error.name === 'ConnectionError') {
      // Network issue - will retry automatically
      console.log('Connection lost, retrying...');
    } else if (error.name === 'M_UNKNOWN_TOKEN') {
      // Token invalid - need to re-login
      handleLogout();
    } else {
      // Other error
      console.error('Sync error:', error);
    }
  }
});
```

### Store Errors

```typescript
try {
  await client.startClient();
} catch (error) {
  if (error.name === 'InvalidStateError') {
    // IndexedDB not available
    console.log('Falling back to memory storage');
    
    // Recreate with memory store
    const newClient = createClient({
      ...config,
      store: { type: 'memory' },
    });
    
    await newClient.startClient();
  }
}
```

## Best Practices

### 1. Always Clean Up

```typescript
// ✅ Good
useEffect(() => {
  client.startClient();
  
  return () => {
    client.stopClient();
  };
}, [client]);

// ❌ Bad - memory leak
useEffect(() => {
  client.startClient();
  // No cleanup!
}, [client]);
```

### 2. Wait for Prepared State

```typescript
// ✅ Good
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  const onSync = (state: SyncState) => {
    if (state === SyncState.Prepared) {
      setIsReady(true);
    }
  };
  
  client.on(ClientEvent.Sync, onSync);
  client.startClient();
  
  return () => client.off(ClientEvent.Sync, onSync);
}, []);

if (!isReady) return <Loading />;

// ❌ Bad - accessing data too early
useEffect(() => {
  client.startClient();
  const rooms = client.getRooms(); // May be empty!
}, []);
```

### 3. Handle Errors Gracefully

```typescript
// ✅ Good
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  const onSync = (state: SyncState, _, data: any) => {
    if (state === SyncState.Error) {
      setError(data);
    }
  };
  
  client.on(ClientEvent.Sync, onSync);
  
  return () => client.off(ClientEvent.Sync, onSync);
}, []);

if (error) {
  return <ErrorView error={error} onRetry={() => client.startClient()} />;
}
```

### 4. Use Single Client Instance

```typescript
// ✅ Good - single instance
const client = useMemo(() => createClient(config), []);

// ❌ Bad - creates new instance every render
const client = createClient(config);
```

## Debugging

### Log Lifecycle Events

```typescript
const states = [
  SyncState.Preparing,
  SyncState.Prepared,
  SyncState.Syncing,
  SyncState.Stopped,
  SyncState.Error,
];

client.on(ClientEvent.Sync, (state, prevState) => {
  console.log(`[Lifecycle] ${prevState} → ${state}`);
  console.log(`[Lifecycle] Timestamp: ${new Date().toISOString()}`);
  console.log(`[Lifecycle] Rooms: ${client.getRooms().length}`);
});
```

### Monitor Performance

```typescript
const startTime = Date.now();

client.once(ClientEvent.Sync, (state) => {
  if (state === SyncState.Prepared) {
    const duration = Date.now() - startTime;
    console.log(`[Performance] Client ready in ${duration}ms`);
  }
});

await client.startClient();
```

## State Diagram

```
                      ┌─────────────┐
                      │   Created   │
                      └──────┬──────┘
                             │
                   startClient()
                             │
                             ▼
                      ┌─────────────┐
                      │  Preparing  │
                      └──────┬──────┘
                             │
                     (Cache loaded)
                             │
                             ▼
                      ┌─────────────┐
                      │  Prepared   │◄──┐
                      └──────┬──────┘   │
                             │          │
                    (Start sync loop)   │
                             │          │
                             ▼          │
                      ┌─────────────┐   │
                      │   Syncing   │───┘
                      └──────┬──────┘
                             │
                     stopClient()
                             │
                             ▼
                      ┌─────────────┐
                      │   Stopped   │
                      └──────┬──────┘
                             │
                       destroy()
                             │
                             ▼
                      ┌─────────────┐
                      │  Destroyed  │
                      └─────────────┘
```

## Next Steps

- [🏗️ Architecture Deep Dive](/docs/advanced/architecture-deep-dive) - Internal architecture
- [📚 Core Concepts](/docs/core-concepts/overview) - High-level overview
- [🔧 Configuration](/docs/getting-started/requirements) - Configuration options
