---
sidebar_position: 1
title: Core Package
description: Complete guide to @xhub-chat/core - framework-agnostic chat SDK
tags: [core, api, javascript, typescript]
---

# 🎯 @xhub-chat/core

Framework-agnostic TypeScript SDK for building real-time chat applications.

## Overview

`@xhub-chat/core` is the foundation of XHub Chat, providing all core functionality without any framework dependencies. It can be used in any JavaScript environment - browsers, Node.js, React Native, or any other JavaScript runtime.

## Installation

```bash
# Using pnpm
pnpm add @xhub-chat/core

# Using npm
npm install @xhub-chat/core

# Using yarn
yarn add @xhub-chat/core
```

## Quick Start

```typescript
import { createClient } from '@xhub-chat/core';

// Create client
const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:example.com',
});

// Start client
await client.startClient();

// Listen for events
client.on('Room', (room) => {
  console.log('New room:', room.name);
});

// Send message
await client.sendTextMessage(roomId, 'Hello World!');
```

## Core Features

### 🔌 Connection Management

- WebSocket and HTTP support
- Automatic reconnection
- Connection state tracking
- Offline queue

### 💾 Storage System

- IndexedDB for persistent storage
- Memory fallback
- Web Worker support
- Automatic synchronization

### 📨 Messaging

- Text messages
- Rich media attachments
- Message reactions
- Threading support
- Read receipts

### 🏠 Room Management

- Create/join/leave rooms
- Room state tracking
- Member management
- Room metadata

### 👥 User Management

- User profiles
- Presence tracking
- Typing indicators
- Avatar management

## Package Structure

```
@xhub-chat/core/
├── client.ts          → Main client class
├── models/
│   ├── room.ts        → Room model
│   ├── event.ts       → Event model
│   └── user.ts        → User model
├── store/
│   ├── memory.ts      → Memory storage
│   └── indexeddb.ts   → IndexedDB storage
├── sync/
│   └── sliding-sync.ts → Sync engine
└── http/
    └── api.ts         → HTTP client
```

## Documentation Sections

<div className="row" style={{ marginTop: '2rem' }}>
  <div className="col col--6">
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <h3>📖 API Reference</h3>
      <p>Complete API documentation for all classes and methods</p>
      <a href="/docs/packages/core/api" className="button button--primary button--sm">
        View API →
      </a>
    </div>
  </div>
  
  <div className="col col--6">
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <h3>📚 Guides</h3>
      <p>Step-by-step guides for common use cases</p>
      <a href="/docs/packages/core/guides/storage" className="button button--primary button--sm">
        Read Guides →
      </a>
    </div>
  </div>
</div>

## Key Classes

### XHubChatClient

Main client class providing all functionality:

```typescript
class XHubChatClient {
  // Connection
  startClient(): Promise<void>
  stopClient(): Promise<void>
  
  // Rooms
  getRoom(roomId: string): Room | null
  getRooms(): Room[]
  joinRoom(roomId: string): Promise<void>
  
  // Messaging
  sendTextMessage(roomId: string, text: string): Promise<void>
  sendMessage(roomId: string, content: any): Promise<void>
  
  // Events
  on(event: string, handler: Function): void
  off(event: string, handler: Function): void
}
```

[Full API Reference](/docs/packages/core/api)

### Room

Represents a chat room:

```typescript
class Room {
  roomId: string
  name: string
  
  // Timeline
  getLiveTimeline(): EventTimeline
  
  // Members
  getMember(userId: string): RoomMember | null
  getMembers(): RoomMember[]
  
  // State
  currentState: RoomState
}
```

### Event

Represents a chat event/message:

```typescript
class Event {
  getId(): string
  getType(): string
  getSender(): string
  getContent(): any
  getTs(): number
}
```

## Configuration Options

```typescript
interface ICreateClientOpts {
  // Required
  baseUrl: string
  accessToken: string
  userId: string
  
  // Optional
  store?: {
    type: 'memory' | 'indexeddb'
    dbName?: string
    workerApi?: boolean
  }
  
  sync?: {
    enabled?: boolean
    slidingSync?: boolean
  }
  
  timelineSupport?: boolean
  cryptoEnabled?: boolean
}
```

## Events

The client emits various events:

```typescript
// Connection events
client.on('sync', (state) => { })
client.on('reconnecting', () => { })

// Room events
client.on('Room', (room) => { })
client.on('Room.timeline', (event, room) => { })
client.on('RoomState.events', (event, state) => { })

// Member events
client.on('RoomMember.membership', (event, member) => { })
client.on('RoomMember.typing', (event, member) => { })
```

[Full Event Reference](/docs/packages/core/api#events)

## Examples

### Basic Chat Application

```typescript
import { createClient, ClientEvent } from '@xhub-chat/core';

// Initialize
const client = createClient({
  baseUrl: 'https://matrix.org',
  accessToken: process.env.ACCESS_TOKEN!,
  userId: '@user:matrix.org',
});

// Listen for messages
client.on(ClientEvent.RoomTimeline, (event, room) => {
  if (event.getType() === 'm.room.message') {
    console.log(`${event.getSender()}: ${event.getContent().body}`);
  }
});

// Start
await client.startClient();

// Send message
const rooms = client.getRooms();
if (rooms.length > 0) {
  await client.sendTextMessage(rooms[0].roomId, 'Hello from Core!');
}
```

### With IndexedDB Storage

```typescript
const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'token',
  userId: '@user:server.com',
  store: {
    type: 'indexeddb',
    dbName: 'my-chat-app',
    workerApi: true, // Use Web Worker
  },
});
```

### Node.js Application

```typescript
import { createClient } from '@xhub-chat/core';

// Works in Node.js (no IndexedDB)
const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: process.env.TOKEN!,
  userId: '@bot:server.com',
  store: {
    type: 'memory', // Use memory store
  },
});

// Bot logic
client.on('Room.timeline', async (event, room) => {
  if (event.getContent().body?.startsWith('!help')) {
    await client.sendTextMessage(
      room.roomId,
      'Available commands: !help, !ping'
    );
  }
});
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  XHubChatClient,
  Room,
  Event,
  RoomMember,
  ICreateClientOpts,
} from '@xhub-chat/core';

const config: ICreateClientOpts = {
  baseUrl: 'https://server.com',
  accessToken: 'token',
  userId: '@user:server.com',
};

const client: XHubChatClient = createClient(config);
const room: Room | null = client.getRoom('!room:server.com');
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Node.js Support

- ✅ Node.js 18+
- ✅ Node.js 20+

## Next Steps

<div className="row" style={{ marginTop: '2rem' }}>
  <div className="col col--4">
    <h4>📚 Guides</h4>
    <ul style={{ paddingLeft: '1.5rem' }}>
      <li><a href="/docs/packages/core/guides/storage">Storage System</a></li>
      <li><a href="/docs/packages/core/guides/events">Event Handling</a></li>
      <li><a href="/docs/packages/core/guides/sync">Sync Protocol</a></li>
    </ul>
  </div>
  
  <div className="col col--4">
    <h4>📖 API Docs</h4>
    <ul style={{ paddingLeft: '1.5rem' }}>
      <li><a href="/docs/packages/core/api">Complete API Reference</a></li>
      <li><a href="/docs/api/classes">Core Classes</a></li>
      <li><a href="/docs/api/config">Configuration</a></li>
    </ul>
  </div>
  
  <div className="col col--4">
    <h4>💡 Examples</h4>
    <ul style={{ paddingLeft: '1.5rem' }}>
      <li><a href="/docs/examples/minimal-example">Minimal Example</a></li>
      <li><a href="/docs/platforms/core">Platform Guide</a></li>
      <li><a href="/docs/advanced/architecture-deep-dive">Architecture</a></li>
    </ul>
  </div>
</div>
