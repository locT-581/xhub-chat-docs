---
sidebar_position: 1
title: "@xhub-chat/core"
description: Framework-agnostic core chat SDK
---

# 📦 @xhub-chat/core

The core SDK provides framework-agnostic chat functionality that can be used with any JavaScript framework or vanilla JavaScript.

## Overview

`@xhub-chat/core` is the foundation of XHub Chat. It handles:

- ✅ WebSocket connections and real-time communication
- ✅ Event-driven architecture with EventEmitter
- ✅ Storage and synchronization (IndexedDB)
- ✅ Room and timeline management
- ✅ Message sending and receiving
- ✅ User presence and typing indicators
- ✅ Offline support and caching

## Installation

```bash
pnpm add @xhub-chat/core
```

## Basic Usage

### Creating a Client

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://api.example.com',
  accessToken: 'your-access-token',
  userId: '@user:example.com',
});

// Start the client
await client.startClient();

console.log('Client started successfully!');
```

### Listening to Events

```typescript
// Listen for new messages
client.on('Room.timeline', (event, room, toStartOfTimeline) => {
  if (event.getType() === 'm.room.message') {
    console.log(`New message in ${room.name}: ${event.getContent().body}`);
  }
});

// Listen for sync state changes
client.on('sync', (state, prevState, data) => {
  console.log('Sync state:', state);
});

// Listen for room updates
client.on('Room.name', (room) => {
  console.log(`Room name changed to: ${room.name}`);
});
```

### Working with Rooms

```typescript
// Get all rooms
const rooms = client.getRooms();
console.log(`You have ${rooms.length} rooms`);

// Get a specific room
const room = client.getRoom('!roomId:example.com');

// Get room members
const members = room.getMembers();

// Get room timeline
const timeline = room.getLiveTimeline();
const events = timeline.getEvents();
```

### Sending Messages

```typescript
// Send a text message
const content = {
  msgtype: 'm.text',
  body: 'Hello, World!',
};

await client.sendMessage('!roomId:example.com', content);

// Send a formatted message
const formattedContent = {
  msgtype: 'm.text',
  body: 'Hello **World**!',
  format: 'org.xhub.custom.html',
  formatted_body: '<p>Hello <strong>World</strong>!</p>',
};

await client.sendMessage('!roomId:example.com', formattedContent);
```

### Managing Reactions

```typescript
// Add a reaction to a message
await client.sendEvent('!roomId:example.com', 'm.reaction', {
  'm.relates_to': {
    rel_type: 'm.annotation',
    event_id: '$messageEventId',
    key: '👍',
  },
});

// Get reactions for an event
const event = room.findEventById('$eventId');
const relations = room.getUnfilteredTimelineSet().relations;
const reactions = relations.getChildEventsForEvent(
  event.getId(),
  'm.annotation',
  'm.reaction'
);
```

## Core APIs

### Client Methods

| Method | Description |
|--------|-------------|
| `startClient()` | Start syncing with the server |
| `stopClient()` | Stop syncing |
| `getRooms()` | Get all joined rooms |
| `getRoom(roomId)` | Get a specific room |
| `sendMessage(roomId, content)` | Send a message |
| `sendEvent(roomId, eventType, content)` | Send a custom event |
| `joinRoom(roomId)` | Join a room |
| `leave(roomId)` | Leave a room |
| `createRoom(options)` | Create a new room |

### Room Methods

| Method | Description |
|--------|-------------|
| `getMembers()` | Get room members |
| `getMember(userId)` | Get a specific member |
| `getLiveTimeline()` | Get the live timeline |
| `getMyMembership()` | Get your membership status |
| `getName()` | Get room name |
| `getTopic()` | Get room topic |
| `getAvatarUrl()` | Get room avatar URL |

### Event Methods

| Method | Description |
|--------|-------------|
| `getType()` | Get event type |
| `getSender()` | Get sender user ID |
| `getContent()` | Get event content |
| `getTs()` | Get timestamp |
| `getId()` | Get event ID |
| `getRoomId()` | Get room ID |

## Storage Configuration

### Using IndexedDB

```typescript
import { createClient, IndexedDBStore } from '@xhub-chat/core';

const store = new IndexedDBStore({
  dbName: 'my-chat-app',
  workerScript: '/workers/indexeddb.worker.js',
});

const client = createClient({
  baseUrl: 'https://api.example.com',
  accessToken: token,
  store,
});
```

### Custom Storage

```typescript
import { IStore } from '@xhub-chat/core';

class CustomStore implements IStore {
  async getItem(key: string): Promise<any> {
    // Your implementation
  }

  async setItem(key: string, value: any): Promise<void> {
    // Your implementation
  }

  async removeItem(key: string): Promise<void> {
    // Your implementation
  }

  // ... implement other required methods
}

const client = createClient({
  baseUrl: 'https://api.example.com',
  accessToken: token,
  store: new CustomStore(),
});
```

## Event Types

### Common Event Types

| Type | Description |
|------|-------------|
| `m.room.message` | Regular message |
| `m.room.member` | Membership change |
| `m.room.name` | Room name change |
| `m.room.topic` | Room topic change |
| `m.room.avatar` | Room avatar change |
| `m.reaction` | Message reaction |
| `m.room.encrypted` | Encrypted message |

### Client Events

| Event | Description |
|-------|-------------|
| `sync` | Sync state changed |
| `Room.timeline` | New event in room |
| `Room.name` | Room name changed |
| `Room.myMembership` | Your membership changed |
| `User.presence` | User presence updated |
| `event` | Any event received |

## Advanced Usage

### Filtering Events

```typescript
const filter = {
  room: {
    timeline: {
      limit: 50,
      types: ['m.room.message'],
    },
  },
};

await client.startClient({ filter });
```

### Pagination

```typescript
const room = client.getRoom(roomId);
const timeline = room.getLiveTimeline();

// Load older messages
const canPaginate = timeline.canPaginateBackwards();
if (canPaginate) {
  await client.paginateEventTimeline(timeline, { backwards: true });
}
```

### Custom Event Handlers

```typescript
// Handle all events
client.on('event', (event) => {
  console.log('Event received:', event.getType());
});

// Handle specific event types
client.on('Room.timeline', (event, room) => {
  if (event.getType() === 'com.example.custom') {
    // Handle custom event
  }
});
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import {
  XHubChatClient,
  Room,
  XHubChatEvent,
  EventTimeline,
  RoomMember,
  ICreateClientOpts,
} from '@xhub-chat/core';

const client: XHubChatClient = createClient(config);
const rooms: Room[] = client.getRooms();
const events: XHubChatEvent[] = room.getLiveTimeline().getEvents();
```

## Performance Tips

1. **Use Filters**: Limit sync data to what you need
2. **Implement Pagination**: Don't load all messages at once
3. **Clean Up Listeners**: Remove event listeners when done
4. **Use IndexedDB**: Enable caching for better performance
5. **Debounce Events**: Batch UI updates for high-frequency events

## Best Practices

```typescript
// ✅ Good: Clean up listeners
const handler = (event) => console.log(event);
client.on('Room.timeline', handler);
// Later...
client.off('Room.timeline', handler);

// ✅ Good: Handle errors
try {
  await client.sendMessage(roomId, content);
} catch (error) {
  console.error('Failed to send message:', error);
}

// ✅ Good: Check room exists
const room = client.getRoom(roomId);
if (room) {
  // Use room
}

// ❌ Bad: Don't forget to start client
const client = createClient(config);
// client.startClient(); // Missing!
```

## Next Steps

- [📘 API Reference](/docs/api/reference) - Complete API documentation
- [🔧 Advanced Topics](/docs/advanced/architecture-deep-dive) - Deep dive
- [💻 Examples](/docs/examples/minimal-example) - Code examples
