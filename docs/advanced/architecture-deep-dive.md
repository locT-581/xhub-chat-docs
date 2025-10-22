---
sidebar_position: 2
title: Architecture Deep Dive
description: Deep dive into XHub Chat internal architecture
---

# 🏗️ Architecture Deep Dive

Comprehensive guide to XHub Chat's internal architecture, design patterns, and implementation details.

## Overview

XHub Chat follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                   React Layer                           │
│        (Hooks, Context, Components)                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Core Client                            │
│            (XHubChatClient API)                         │
└─────┬──────────────┬──────────────┬─────────────────────┘
      │              │              │
      ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Sync    │  │  Store   │  │   HTTP   │
│  Engine  │  │  Layer   │  │   API    │
└──────────┘  └──────────┘  └──────────┘
      │              │              │
      └──────────────┴──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  WebSocket   │
              │  Connection  │
              └──────────────┘
```

## Core Components

### 1. XHubChatClient

The main entry point that orchestrates all functionality.

**Responsibilities:**
- Initialize and manage all subsystems
- Provide unified API for consumers
- Handle lifecycle (startup/shutdown)
- Emit events for state changes

**Key Code:**

```typescript
export class XHubChatClient extends TypedEventEmitter<Events, EventHandlerMap> {
  private store: IStore;
  private syncApi: SyncApi;
  private http: XHubChatHttpApi;
  private syncState: SyncState = SyncState.Stopped;

  constructor(opts: ICreateClientOpts) {
    super();
    
    // Initialize store
    this.store = this.createStore(opts.store);
    
    // Initialize HTTP API
    this.http = new XHubChatHttpApi(opts);
    
    // Initialize sync engine
    this.syncApi = new SyncApi(this, opts);
  }

  public async startClient(opts?: IStartClientOpts): Promise<void> {
    // 1. Start store
    await this.store.startup();
    
    // 2. Load cached data
    await this.restoreFromCache();
    
    // 3. Start syncing
    await this.syncApi.sync(opts);
    
    this.emit(ClientEvent.Sync, SyncState.Prepared);
  }
}
```

### 2. Store Architecture

The store layer handles all data persistence with multiple implementations.

#### Store Hierarchy

```
┌────────────────────────────────────────────────────────────┐
│                     IStore Interface                       │
│   (Contract: getRoom, storeRoom, save, etc.)               │
└────────────────────┬───────────────────────────────────────┘
                     │
        ┌────────────┴────────────────┐
        │                             │
        ▼                             ▼
┌──────────────┐             ┌──────────────┐
│  StubStore   │             │ MemoryStore  │
│  (No-op)     │             │ (In-memory)  │
└──────────────┘             └────────┬─────┘
                                      │ Extends
                                      │
                                      ▼
                            ┌──────────────────┐
                            │ IndexedDBStore   │
                            │ (Persistent)     │
                            └────────┬─────────┘
                                     │
                ┌────────────────────┴────────────────┐
                │                                     │
                ▼                                     ▼
    ┌─────────────────────┐           ┌─────────────────────┐
    │ LocalIndexedDB      │           │ RemoteIndexedDB     │
    │ Backend             │           │ Backend             │
    │ (Main Thread)       │           │ (Web Worker)        │
    └─────────────────────┘           └────────┬────────────┘
                                               │
                                               │ Uses
                                               │
                                               ▼
                                   ┌─────────────────────┐
                                   │ IndexedDBStore      │
                                   │ Worker              │
                                   │ (Wraps Local)       │
                                   └─────────────────────┘
```

#### IStore Interface

```typescript
export interface IStore {
  // Sync management
  getSyncToken(): string | null;
  setSyncToken(token: string): void;
  
  // Room operations
  storeRoom(room: Room): void;
  getRoom(roomId: string): Room | null;
  getRooms(): Room[];
  removeRoom(roomId: string): void;
  
  // Event operations
  storeEvents(room: Room, events: Event[], token: string | null, toStart: boolean): void;
  scrollback(room: Room, limit: number): Event[];
  
  // User operations
  storeUser(user: User): void;
  getUser(userId: string): User | null;
  
  // Lifecycle
  startup(): Promise<void>;
  save(force?: boolean): Promise<void>;
  deleteAllData(): Promise<void>;
  destroy(): Promise<void>;
}
```

#### MemoryStore Implementation

```typescript
export class MemoryStore implements IStore {
  private rooms: Record<string, Room> = {};
  private users: Record<string, User> = {};
  private syncToken: string | null = null;
  public accountData: Map<string, Event> = new Map();
  
  public storeRoom(room: Room): void {
    this.rooms[room.roomId] = room;
  }
  
  public getRoom(roomId: string): Room | null {
    return this.rooms[roomId] || null;
  }
  
  public getRooms(): Room[] {
    return Object.values(this.rooms);
  }
  
  // In-memory only, no persistence
  public async save(): Promise<void> {
    // No-op for memory store
  }
}
```

#### IndexedDBStore Implementation

Extends MemoryStore and adds IndexedDB persistence:

```typescript
export class IndexedDBStore extends MemoryStore {
  private backend: IIndexedDBBackend;
  private syncAccumulator = new SyncAccumulator();
  
  constructor(opts: IndexedDBStoreOpts) {
    super(opts);
    
    // Choose backend based on worker support
    if (opts.workerApi && isWorkerSupported()) {
      this.backend = new RemoteIndexedDBStoreBackend(
        opts.workerFactory,
        opts.dbName
      );
    } else {
      this.backend = new LocalIndexedDBStoreBackend(opts.dbName);
    }
  }
  
  public async startup(): Promise<void> {
    // 1. Connect to IndexedDB
    await this.backend.connect();
    
    // 2. Load cached data
    const savedSync = await this.backend.getSavedSync();
    if (savedSync) {
      this.syncToken = savedSync.nextBatch;
      
      // Restore rooms
      for (const roomData of savedSync.roomsData || []) {
        const room = new Room(roomData.roomId, this.client, this.client.getUserId());
        room.deserialize(roomData);
        this.storeRoom(room);
      }
    }
  }
  
  public async save(force?: boolean): Promise<void> {
    if (!force && !this.syncAccumulator.hasPendingData()) {
      return;
    }
    
    const data = this.syncAccumulator.getJSON();
    await this.backend.syncToDatabase(data);
    this.syncAccumulator.clear();
  }
}
```

### 3. Sync Engine

Handles synchronization with the server using sliding sync protocol.

#### Sliding Sync Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SyncApi                                │
│  - Manages sync loop                                        │
│  - Handles reconnection                                     │
│  - Processes sync responses                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  SlidingSyncSdk                             │
│  - Sliding sync implementation                              │
│  - List management                                          │
│  - Room subscriptions                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  HTTP/WebSocket                             │
│  - Long-polling or WebSocket                                │
│  - Automatic retries                                        │
└─────────────────────────────────────────────────────────────┘
```

#### Sync Flow

```typescript
export class SyncApi {
  private client: XHubChatClient;
  private running = false;
  
  public async sync(opts?: IStartClientOpts): Promise<void> {
    this.running = true;
    
    while (this.running) {
      try {
        // 1. Send sync request
        const response = await this.client.http.authedRequest(
          Method.Get,
          '/sync',
          {
            timeout: 30000,
            filter: opts?.filter,
            since: this.client.store.getSyncToken(),
          }
        );
        
        // 2. Process response
        await this.processSyncResponse(response);
        
        // 3. Update sync token
        this.client.store.setSyncToken(response.next_batch);
        
        // 4. Save to database
        await this.client.store.save();
        
        // 5. Emit sync event
        this.client.emit(ClientEvent.Sync, SyncState.Syncing);
        
      } catch (error) {
        logger.error('Sync error:', error);
        await this.handleSyncError(error);
      }
    }
  }
  
  private async processSyncResponse(data: ISyncResponse): Promise<void> {
    // Process rooms
    for (const [roomId, roomData] of Object.entries(data.rooms.join)) {
      let room = this.client.getRoom(roomId);
      
      if (!room) {
        room = new Room(roomId, this.client, this.client.getUserId());
        this.client.store.storeRoom(room);
      }
      
      // Add timeline events
      const events = roomData.timeline?.events.map(e => new Event(e)) || [];
      room.addLiveEvents(events);
      
      // Update room state
      if (roomData.state) {
        room.currentState.setStateEvents(
          roomData.state.events.map(e => new Event(e))
        );
      }
      
      this.client.emit(ClientEvent.Room, room);
    }
    
    // Process account data
    if (data.account_data) {
      const events = data.account_data.events.map(e => new Event(e));
      this.client.store.storeAccountDataEvents(events);
    }
  }
}
```

### 4. Event System

Type-safe event emitter for all client events.

```typescript
export enum ClientEvent {
  Sync = "sync",
  Room = "Room",
  Event = "Event",
  RoomTimeline = "Room.timeline",
  RoomState = "RoomState.events",
  RoomMember = "RoomMember.membership",
  DeleteRoom = "deleteRoom",
}

export interface Events {
  [ClientEvent.Sync]: (state: SyncState, prevState: SyncState | null) => void;
  [ClientEvent.Room]: (room: Room) => void;
  [ClientEvent.Event]: (event: Event) => void;
  [ClientEvent.RoomTimeline]: (
    event: Event,
    room: Room | undefined,
    toStartOfTimeline: boolean
  ) => void;
}

// Usage
client.on(ClientEvent.Room, (room) => {
  console.log('New room:', room.name);
});
```

### 5. Room Model

Represents a chat room with state, timeline, and members.

```typescript
export class Room extends TypedEventEmitter<Events, EventHandlerMap> {
  public roomId: string;
  public name: string;
  public currentState: RoomState;
  private timeline: Event[] = [];
  private members: Map<string, RoomMember> = new Map();
  
  constructor(roomId: string, client: XHubChatClient, userId: string) {
    super();
    this.roomId = roomId;
    this.currentState = new RoomState(roomId, client, userId);
  }
  
  public addLiveEvents(events: Event[]): void {
    for (const event of events) {
      this.timeline.push(event);
      
      // Update room state if state event
      if (event.isState()) {
        this.currentState.setStateEvents([event]);
      }
      
      this.emit(RoomEvent.Timeline, event, this, false);
    }
  }
  
  public getLiveTimeline(): Event[] {
    return this.timeline;
  }
  
  public getMember(userId: string): RoomMember | null {
    return this.members.get(userId) || null;
  }
}
```

## Data Flow

### Sending a Message

```
┌──────────┐     1. sendTextMessage()       ┌──────────┐
│  React   │ ──────────────────────────────>│  Client  │
│  Hook    │                                └────┬─────┘
└──────────┘                                     │
                                                 │ 2. Create Event
                                                 │
                                                 ▼
                                          ┌──────────┐
                                          │   Room   │
                                          └────┬─────┘
                                               │
                                               │ 3. Optimistic Update
                                               │
                                               ▼
                                          ┌──────────┐
                                          │  Store   │
                                          └────┬─────┘
                                               │
                                               │ 4. HTTP POST
                                               │
                                               ▼
                                          ┌──────────┐
                                          │  Server  │
                                          └────┬─────┘
                                               │
                                               │ 5. Sync Response
                                               │
                                               ▼
                                          ┌──────────┐
                                          │  Client  │
                                          └────┬─────┘
                                               │
                                               │ 6. Update Event ID
                                               │
                                               ▼
                                          ┌──────────┐
                                          │   Room   │
                                          └──────────┘
```

### Receiving a Message

```
┌──────────┐     1. Sync Response           ┌──────────┐
│  Server  │ ──────────────────────────────>│  Client  │
└──────────┘                                └────┬─────┘
                                                 │
                                                 │ 2. Process Events
                                                 │
                                                 ▼
                                          ┌──────────┐
                                          │   Room   │
                                          └────┬─────┘
                                               │
                                               │ 3. Add to Timeline
                                               │
                                               ▼
                                          ┌──────────┐
                                          │  Store   │
                                          └────┬─────┘
                                               │
                                               │ 4. Emit Event
                                               │
                                               ▼
                                          ┌──────────┐
                                          │  React   │
                                          │  Hook    │
                                          └──────────┘
```

## Performance Optimizations

### 1. Web Worker for IndexedDB

Move IndexedDB operations off the main thread:

```typescript
// Main thread
const backend = new RemoteIndexedDBStoreBackend(
  () => new Worker('/indexeddb.worker.js'),
  'xhub-chat-db'
);

// Worker thread
class IndexedDBStoreWorker {
  private backend: LocalIndexedDBStoreBackend;
  
  constructor() {
    this.backend = new LocalIndexedDBStoreBackend('xhub-chat-db');
    self.addEventListener('message', this.onMessage.bind(this));
  }
  
  private async onMessage(event: MessageEvent): Promise<void> {
    const { command, data, seq } = event.data;
    
    try {
      const result = await this.backend[command](data);
      self.postMessage({ seq, result });
    } catch (error) {
      self.postMessage({ seq, error: error.message });
    }
  }
}
```

### 2. Sync Accumulator

Batch database writes to reduce I/O:

```typescript
export class SyncAccumulator {
  private accountData: Event[] = [];
  private roomsData: Map<string, RoomData> = new Map();
  
  public accumulate(syncResponse: ISyncResponse): void {
    // Accumulate changes
    if (syncResponse.account_data) {
      this.accountData.push(...syncResponse.account_data.events);
    }
    
    // Don't write yet, wait for save() call
  }
  
  public hasPendingData(): boolean {
    return this.accountData.length > 0 || this.roomsData.size > 0;
  }
  
  public getJSON(): any {
    return {
      accountData: this.accountData,
      roomsData: Array.from(this.roomsData.values()),
    };
  }
  
  public clear(): void {
    this.accountData = [];
    this.roomsData.clear();
  }
}
```

### 3. Event Pagination

Load events on-demand to reduce memory usage:

```typescript
export class Room {
  private timeline: Event[] = [];
  private timelineState = {
    pagination: {
      backwards: true,  // Can load older events
      forwards: false,  // At live edge
    },
  };
  
  public async paginate(direction: 'b' | 'f', limit = 30): Promise<void> {
    if (direction === 'b' && !this.timelineState.pagination.backwards) {
      return; // Already at start
    }
    
    const token = this.getLiveTimeline().getPaginationToken(direction);
    
    const response = await this.client.http.authedRequest(
      Method.Get,
      `/rooms/${this.roomId}/messages`,
      {
        from: token,
        dir: direction,
        limit,
      }
    );
    
    const events = response.chunk.map((e: any) => new Event(e));
    
    if (direction === 'b') {
      this.timeline.unshift(...events);
    } else {
      this.timeline.push(...events);
    }
    
    // Update pagination state
    if (!response.end) {
      this.timelineState.pagination[direction === 'b' ? 'backwards' : 'forwards'] = false;
    }
  }
}
```

## Best Practices

### 1. Use TypeScript Strictly

```typescript
// Bad
const room: any = client.getRoom(roomId);

// Good
const room: Room | null = client.getRoom(roomId);
if (room) {
  const events: Event[] = room.getLiveTimeline().getEvents();
}
```

### 2. Handle Errors Gracefully

```typescript
try {
  await client.sendTextMessage(roomId, 'Hello');
} catch (error) {
  if (error instanceof MatrixError) {
    if (error.errcode === 'M_FORBIDDEN') {
      // Handle permission error
    }
  }
}
```

### 3. Clean Up Event Listeners

```typescript
useEffect(() => {
  const onRoom = (room: Room) => {
    console.log('New room:', room.name);
  };
  
  client.on(ClientEvent.Room, onRoom);
  
  return () => {
    client.off(ClientEvent.Room, onRoom);
  };
}, [client]);
```

### 4. Use Memoization

```typescript
const events = useMemo(() => {
  return room?.getLiveTimeline().getEvents() || [];
}, [room, room?.timeline.length]);
```

## Testing Architecture

XHub Chat uses Jest for unit testing with extensive mocks:

```typescript
describe('Room', () => {
  let client: MockClient;
  let room: Room;
  
  beforeEach(() => {
    client = new MockClient();
    room = new Room('!room:server', client, '@user:server');
  });
  
  it('should add live events', () => {
    const event = new Event({
      type: 'm.room.message',
      content: { body: 'Hello' },
    });
    
    room.addLiveEvents([event]);
    
    expect(room.getLiveTimeline().getEvents()).toContain(event);
  });
});
```

## Next Steps

- [📚 Core Concepts](/docs/core-concepts/overview) - High-level overview
- [🔧 Lifecycle](/docs/advanced/lifecycle) - Client lifecycle management
- [💡 API Reference](/docs/api/reference) - Full API documentation
