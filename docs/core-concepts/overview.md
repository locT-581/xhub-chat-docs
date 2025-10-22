---
sidebar_position: 1
title: Overview
description: Understand the core concepts behind XHub Chat architecture
---

# 💡 Core Concepts

Learn the fundamental concepts that power XHub Chat and how they work together to create a robust chat experience.

## Architecture Overview

XHub Chat is built on a **layered architecture** that separates concerns and promotes modularity:

```
┌─────────────────────────────────────┐
│   Application Layer (Your App)      │
│   - React Components                │
│   - UI Logic                        │
└─────────────────────────────────────┘
           ↓ uses
┌────────────────────────────────────────┐
│   React Integration (@xhub-chat/react) │
│   - Hooks (useRooms, useTimeline).     │
│   - Context Provider                   │
│   - State Management                   │
└────────────────────────────────────────┘
           ↓ uses
┌─────────────────────────────────────┐
│   Core SDK (@xhub-chat/core)        │
│   - Client API                      │
│   - Event System                    │
│   - Storage & Sync                  │
└─────────────────────────────────────┘
           ↓ communicates with
┌─────────────────────────────────────┐
│   Backend Server                    │
│   - REST API                        │
│   - WebSocket                       │
│   - Database                        │
└─────────────────────────────────────┘
```

## Key Concepts

### 1. Client

The **Client** is the central hub of XHub Chat. It manages:

- Authentication and session management
- Connection to the server (HTTP + WebSocket)
- Event dispatching and handling
- Data synchronization

**Example:**

```tsx
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://api.example.com',
  accessToken: 'your-token',
});

// Start the client
await client.startClient();
```

### 2. Rooms

**Rooms** are the primary containers for conversations. Each room has:

- Unique identifier (`roomId`)
- Members (users who can access the room)
- Timeline of events (messages, state changes)
- Metadata (name, topic, avatar)

**Room Types:**

- **Direct Messages**: 1-on-1 conversations
- **Group Chats**: Multiple participants
- **Public Channels**: Open to all users
- **Private Channels**: Invite-only

### 3. Events

Everything in XHub Chat is an **Event**. Events are immutable records of actions that occurred:

**Event Types:**

| Type | Description | Example |
|------|-------------|---------|
| `m.room.message` | Text message | "Hello, world!" |
| `m.room.member` | Membership change | User joined/left |
| `m.reaction` | Message reaction | 👍 emoji |
| `m.room.name` | Room name change | "Team Chat" |

**Event Structure:**

```typescript
{
  type: 'm.room.message',
  sender: '@user:example.com',
  room_id: '!abc123:example.com',
  content: {
    msgtype: 'm.text',
    body: 'Hello!'
  },
  event_id: '$event123',
  origin_server_ts: 1234567890
}
```

### 4. Timeline

The **Timeline** is an ordered sequence of events in a room. It supports:

- Pagination (load more messages)
- Real-time updates (new messages appear instantly)
- Local echo (optimistic UI updates)

**Timeline Flow:**

```
Older Messages ← [Timeline] ← Newer Messages ← Live Updates
     ↑                              ↓
  Load More                    Scroll to view
```

### 5. Sync

**Sync** keeps your local state synchronized with the server:

1. Client requests latest data
2. Server sends updates (new events, room changes)
3. Client processes and stores updates
4. UI re-renders with new data

**Sync Loop:**

```
Client → Request Sync → Server
   ↑                        ↓
   ← Process Updates ← Response
```

### 6. Storage

XHub Chat uses **IndexedDB** for persistent storage:

- **Offline Support**: Read messages without connection
- **Fast Loading**: Instant app startup
- **Efficient Sync**: Only download new data

**Storage Layers:**

```
Memory Cache (Fast, Volatile)
        ↓
IndexedDB (Persistent, Browser)
        ↓
Server (Source of Truth)
```

### 7. Event Emitters

XHub Chat uses **EventEmitter** pattern for real-time updates:

```tsx
client.on('Room.timeline', (event, room) => {
  console.log('New event in room:', room.name);
});

client.on('Room.name', (room) => {
  console.log('Room name changed:', room.name);
});
```

**Common Events:**

- `Room.timeline` - New message or event
- `Room.name` - Room name changed
- `Room.myMembership` - Your membership status changed
- `sync` - Sync state changed

## Data Flow

### Sending a Message

```
User Types → Component → Hook → Client → Server
                                    ↓
                              Local Echo
                                    ↓
                            Timeline Update
                                    ↓
                             UI Re-renders
```

### Receiving a Message

```
Server → WebSocket → Client → Event Emitter
                          ↓
                    Storage (IndexedDB)
                          ↓
                   Timeline Update
                          ↓
                    React State Update
                          ↓
                     UI Re-renders
```

## State Management

XHub Chat manages state at multiple levels:

### 1. Server State (Source of Truth)

- Persisted in database
- Accessible via REST API
- Synchronized via WebSocket

### 2. Client State (Local Cache)

- Stored in IndexedDB
- Updated by sync process
- Used for offline access

### 3. React State (UI State)

- Managed by hooks
- Derived from client state
- Triggers UI updates

## Performance Considerations

### 1. Lazy Loading

- Rooms load on-demand
- Messages paginate (load older on scroll)
- Members fetch when needed

### 2. Virtual Scrolling

- Render only visible messages
- Reduce memory usage for large rooms
- Smooth scrolling performance

### 3. Debouncing & Throttling

- Typing indicators debounced
- Scroll events throttled
- Search queries debounced

## Security Model

### 1. Authentication

- Access tokens (JWT or similar)
- Automatic token refresh
- Secure token storage

### 2. Authorization

- Room-level permissions
- Event-level access control
- Member roles (admin, moderator, user)

### 3. Encryption (Optional)

- End-to-end encryption support
- Device verification
- Key management

## Extension Points

XHub Chat is designed to be extensible:

### Custom Storage

```tsx
import { IStore } from '@xhub-chat/core';

class MyCustomStore implements IStore {
  // Implement storage methods
}
```

### Custom Event Handlers

```tsx
client.on('*', (eventType, ...args) => {
  // Handle all events
  if (eventType === 'custom.event') {
    // Custom logic
  }
});
```

### Middleware Pattern

```tsx
client.use((event, next) => {
  // Pre-process events
  console.log('Event:', event.getType());
  next();
});
```

## Best Practices

1. **Always Start the Client**: Call `client.startClient()` before using
2. **Handle Errors**: Wrap operations in try-catch
3. **Clean Up**: Remove event listeners on unmount
4. **Optimize Renders**: Use React.memo and useMemo
5. **Test Offline**: Ensure app works without connection

## Next Steps

- [🏗️ Architecture Deep Dive](/docs/core-concepts/architecture)
- [🎨 Design Philosophy](/docs/core-concepts/design-philosophy)
- [❓ FAQ](/docs/core-concepts/faq)
- [📘 API Reference](/docs/api/reference)
