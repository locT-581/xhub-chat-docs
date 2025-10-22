---
sidebar_position: 2
title: "@xhub-chat/react"
description: React hooks and components for XHub Chat
---

# ⚛️ @xhub-chat/react

React integration for XHub Chat with hooks, context, and utilities for building chat UIs.

## Overview

`@xhub-chat/react` provides React-specific tools to integrate XHub Chat into your React applications:

- ✅ React Hooks for common chat operations
- ✅ Context Provider for global client access
- ✅ Automatic state management and updates
- ✅ TypeScript support with full type inference
- ✅ Optimized re-renders with React best practices

## Installation

```bash
pnpm add @xhub-chat/core @xhub-chat/react react
```

## Setup

### 1. Wrap Your App with Provider

```tsx
import { XHubChatProvider } from '@xhub-chat/react';

function App() {
  return (
    <XHubChatProvider
      config={{
        baseUrl: 'https://api.example.com',
        accessToken: 'your-token',
      }}
    >
      <YourChatApp />
    </XHubChatProvider>
  );
}
```

### 2. Use Hooks in Components

```tsx
import { useRooms, useXHubChat } from '@xhub-chat/react';

function ChatRooms() {
  const { rooms, loading } = useRooms();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {rooms.map(room => (
        <div key={room.roomId}>{room.name}</div>
      ))}
    </div>
  );
}
```

## Core Hooks

### useXHubChat

Access the XHub Chat client instance.

```tsx
import { useXHubChat } from '@xhub-chat/react';

function MyComponent() {
  const client = useXHubChat();
  
  const sendMessage = async () => {
    await client.sendTextMessage(roomId, 'Hello!');
  };
  
  return <button onClick={sendMessage}>Send</button>;
}
```

### useRooms

Get all rooms the user has joined.

```tsx
import { useRooms } from '@xhub-chat/react';

function RoomList() {
  const { rooms, loading, error } = useRooms();
  
  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {rooms.map(room => (
        <li key={room.roomId}>
          {room.name} ({room.getJoinedMemberCount()} members)
        </li>
      ))}
    </ul>
  );
}
```

**Return Value:**

```typescript
{
  rooms: Room[];        // Array of Room objects
  loading: boolean;     // True while initial load
  error: Error | null;  // Error if loading failed
}
```

### useTimeline

Get messages and events from a room's timeline.

```tsx
import { useTimeline } from '@xhub-chat/react';

function MessageList({ roomId }: { roomId: string }) {
  const {
    events,
    loading,
    hasMore,
    loadMore,
    error,
  } = useTimeline(roomId);
  
  if (loading) return <div>Loading messages...</div>;
  
  return (
    <div>
      {hasMore && (
        <button onClick={loadMore}>Load More</button>
      )}
      {events.map(event => (
        <div key={event.getId()}>
          <strong>{event.getSender()}</strong>
          <p>{event.getContent().body}</p>
        </div>
      ))}
    </div>
  );
}
```

**Return Value:**

```typescript
{
  events: XHubChatEvent[];  // Array of events
  loading: boolean;         // Initial load state
  hasMore: boolean;         // Can load more messages
  loadMore: () => void;     // Load older messages
  error: Error | null;      // Error if any
}
```

### useReactions

Manage reactions on messages.

```tsx
import { useReactions } from '@xhub-chat/react';

function MessageWithReactions({ roomId, eventId }: Props) {
  const {
    reactions,
    addReaction,
    removeReaction,
    loading,
  } = useReactions(roomId, eventId);
  
  return (
    <div>
      {reactions.map(reaction => (
        <button
          key={reaction.key}
          onClick={() => removeReaction(reaction.key)}
        >
          {reaction.key} {reaction.count}
        </button>
      ))}
      <button onClick={() => addReaction('👍')}>
        Add 👍
      </button>
    </div>
  );
}
```

**Return Value:**

```typescript
{
  reactions: Array<{
    key: string;
    count: number;
    userIds: string[];
  }>;
  addReaction: (emoji: string) => Promise<void>;
  removeReaction: (emoji: string) => Promise<void>;
  loading: boolean;
}
```

### useThread

Get messages in a thread (replies to a message).

```tsx
import { useThread } from '@xhub-chat/react';

function ThreadView({ roomId, eventId }: Props) {
  const {
    events,
    loading,
    sendReply,
  } = useThread(roomId, eventId);
  
  const handleReply = async (text: string) => {
    await sendReply(text);
  };
  
  return (
    <div>
      <h3>Thread</h3>
      {events.map(event => (
        <div key={event.getId()}>{event.getContent().body}</div>
      ))}
      <input onSubmit={handleReply} />
    </div>
  );
}
```

## Utility Hooks

### useEventEmitter

Listen to client events with automatic cleanup.

```tsx
import { useEventEmitter } from '@xhub-chat/react';

function ConnectionStatus() {
  const [status, setStatus] = useState('disconnected');
  const client = useXHubChat();
  
  useEventEmitter(client, 'sync', (state) => {
    setStatus(state);
  });
  
  return <div>Status: {status}</div>;
}
```

### useTypingIndicator

Show typing indicators for a room.

```tsx
import { useTypingIndicator } from '@xhub-chat/react';

function TypingIndicator({ roomId }: { roomId: string }) {
  const { typingUsers, sendTyping } = useTypingIndicator(roomId);
  
  const handleKeyPress = () => {
    sendTyping();
  };
  
  if (typingUsers.length === 0) return null;
  
  return (
    <div>
      {typingUsers.map(u => u.name).join(', ')} is typing...
    </div>
  );
}
```

## Advanced Usage

### Custom Event Handling

```tsx
import { useEffect } from 'react';
import { useXHubChat } from '@xhub-chat/react';

function CustomEventHandler() {
  const client = useXHubChat();
  
  useEffect(() => {
    const handler = (event, room) => {
      if (event.getType() === 'com.example.custom') {
        console.log('Custom event received');
      }
    };
    
    client.on('Room.timeline', handler);
    return () => client.off('Room.timeline', handler);
  }, [client]);
  
  return null;
}
```

### Optimistic Updates

```tsx
function MessageSender({ roomId }: { roomId: string }) {
  const client = useXHubChat();
  const [messages, setMessages] = useState<any[]>([]);
  
  const sendMessage = async (text: string) => {
    // Add optimistic message
    const optimisticMsg = {
      id: Date.now(),
      text,
      pending: true,
    };
    setMessages(prev => [...prev, optimisticMsg]);
    
    try {
      await client.sendTextMessage(roomId, text);
      // Update with real message
      setMessages(prev =>
        prev.filter(m => m.id !== optimisticMsg.id)
      );
    } catch (error) {
      // Mark as failed
      setMessages(prev =>
        prev.map(m =>
          m.id === optimisticMsg.id
            ? { ...m, failed: true }
            : m
        )
      );
    }
  };
  
  return <MessageInput onSend={sendMessage} />;
}
```

### Pagination with Infinite Scroll

```tsx
import { useTimeline } from '@xhub-chat/react';
import InfiniteScroll from 'react-infinite-scroll-component';

function InfiniteMessageList({ roomId }: { roomId: string }) {
  const { events, hasMore, loadMore } = useTimeline(roomId);
  
  return (
    <InfiniteScroll
      dataLength={events.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<div>Loading...</div>}
      scrollableTarget="message-list"
    >
      {events.map(event => (
        <Message key={event.getId()} event={event} />
      ))}
    </InfiniteScroll>
  );
}
```

## TypeScript Support

Full TypeScript support with type inference:

```tsx
import type {
  Room,
  XHubChatEvent,
  XHubChatClient,
} from '@xhub-chat/react';

const client: XHubChatClient = useXHubChat();
const rooms: Room[] = useRooms().rooms;
const events: XHubChatEvent[] = useTimeline(roomId).events;
```

## Performance Optimization

### Memoization

```tsx
import { memo, useMemo } from 'react';
import { useTimeline } from '@xhub-chat/react';

const MessageList = memo(({ roomId }: { roomId: string }) => {
  const { events } = useTimeline(roomId);
  
  const messageComponents = useMemo(
    () => events.map(e => <Message key={e.getId()} event={e} />),
    [events]
  );
  
  return <div>{messageComponents}</div>;
});
```

### Selective Re-renders

```tsx
import { useRooms } from '@xhub-chat/react';

function RoomCount() {
  const { rooms } = useRooms();
  
  // Only re-render when count changes
  const roomCount = useMemo(() => rooms.length, [rooms.length]);
  
  return <div>{roomCount} rooms</div>;
}
```

## Best Practices

1. **Use Context Provider**: Always wrap your app with `XHubChatProvider`
2. **Clean Up Effects**: Remove event listeners in cleanup functions
3. **Handle Loading States**: Show loading indicators while data loads
4. **Handle Errors**: Display error messages to users
5. **Optimize Re-renders**: Use `memo`, `useMemo`, and `useCallback`
6. **Type Everything**: Leverage TypeScript for type safety

## Common Patterns

### Room Switcher

```tsx
function RoomSwitcher() {
  const { rooms } = useRooms();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  
  return (
    <div>
      <aside>
        {rooms.map(room => (
          <button
            key={room.roomId}
            onClick={() => setActiveRoomId(room.roomId)}
          >
            {room.name}
          </button>
        ))}
      </aside>
      <main>
        {activeRoomId && <ChatRoom roomId={activeRoomId} />}
      </main>
    </div>
  );
}
```

### Search Messages

```tsx
function MessageSearch({ roomId }: { roomId: string }) {
  const { events } = useTimeline(roomId);
  const [query, setQuery] = useState('');
  
  const filteredEvents = useMemo(() => {
    if (!query) return events;
    return events.filter(e =>
      e.getContent().body?.toLowerCase().includes(query.toLowerCase())
    );
  }, [events, query]);
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search messages..."
      />
      {filteredEvents.map(e => <Message key={e.getId()} event={e} />)}
    </div>
  );
}
```

## Next Steps

- [📘 API Reference](/docs/api/hooks) - Complete hooks documentation
- [💡 Guides](/docs/guides/using-with-react) - React integration guide
- [💻 Examples](/docs/examples/full-app) - Full React examples
