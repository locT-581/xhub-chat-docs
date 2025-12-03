---
sidebar_position: 2
title: Hooks API
description: Complete React hooks API reference
---

# 🪝 React Hooks API

Complete reference for all React hooks provided by `@xhub-chat/react`.

## Core Hooks

### useXHubChat

Access the XHub Chat client from context.

**Type Signature:**

```typescript
function useXHubChat(): XHubChatContextValue

interface XHubChatContextValue {
  client: XHubChatClient;
  rooms: Room[];
  getRoom: (roomId: string) => Room | null;
}
```

**Usage:**

```tsx
import { useXHubChat } from '@xhub-chat/react';

function MyComponent() {
  const { client, rooms, getRoom } = useXHubChat();
  
  const handleSend = async () => {
    await client.sendTextMessage(roomId, 'Hello!');
  };
  
  return <div>Total rooms: {rooms.length}</div>;
}
```

**Returns:**

- `client` - XHub Chat client instance
- `rooms` - Array of all rooms (auto-updates)
- `getRoom` - Function to get room by ID

**Throws:**

- `Error` - If used outside `XHubChatProvider`

**Example - Send Message:**

```tsx
function SendButton({ roomId }: { roomId: string }) {
  const { client } = useXHubChat();
  
  const send = async () => {
    try {
      await client.sendTextMessage(roomId, 'Hello World!');
    } catch (error) {
      console.error('Failed to send:', error);
    }
  };
  
  return <button onClick={send}>Send</button>;
}
```

---

### useRooms

Access all rooms with pagination support.

**Type Signature:**

```typescript
function useRooms(): IUserRooms

interface IUserRooms {
  rooms: Room[];
  canPaginate: boolean;
  error: Error | null;
  fetching?: boolean;
  paginate: (limit: number) => Promise<void>;
  getRoomById: (roomId: string) => Room | null;
}
```

**Usage:**

```tsx
import { useRooms } from '@xhub-chat/react';

function RoomList() {
  const { rooms, canPaginate, paginate, fetching } = useRooms();
  
  return (
    <div>
      {rooms.map(room => (
        <div key={room.roomId}>{room.name}</div>
      ))}
      
      {canPaginate && (
        <button onClick={() => paginate(20)} disabled={fetching}>
          {fetching ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

**Returns:**

- `rooms` - Array of all rooms (auto-updates)
- `canPaginate` - Whether more rooms can be loaded
- `error` - Any pagination error
- `fetching` - Whether currently loading
- `paginate(limit)` - Function to load more rooms
- `getRoomById(id)` - Get specific room

**Example - Infinite Scroll:**

```tsx
function InfiniteRoomList() {
  const { rooms, canPaginate, paginate } = useRooms();
  const observerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!canPaginate) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          paginate(20);
        }
      },
      { threshold: 0.1 }
    );
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    
    return () => observer.disconnect();
  }, [canPaginate, paginate]);
  
  return (
    <div>
      {rooms.map(room => <RoomItem key={room.roomId} room={room} />)}
      <div ref={observerRef} />
    </div>
  );
}
```

---

### useTimeline

Access and manage a room's timeline (messages).

**Type Signature:**

```typescript
function useTimeline(props: IUseTimelineProps): IUseTimeline

interface IUseTimelineProps {
  roomId: string;
  timelineSet?: EventTimelineSet;
}

interface IUseTimeline {
  events: XHubChatEvent[];
  room: Room | null;
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  canPaginateForwards: boolean;
  canPaginateBackwards: boolean;
  isPaginatingForwards: boolean;
  isPaginatingBackwards: boolean;
  paginate: (direction: 'f' | 'b', limit?: number) => Promise<void>;
  
  // Messaging
  sendTextMessage: (text: string) => Promise<void>;
  sendMessage: (content: any) => Promise<void>;
  resendEvent: (eventId: string) => Promise<void>;
  cancelPendingEvent: (eventId: string) => void;
  
  // Reactions
  addReaction: (eventId: string, emoji: string) => Promise<void>;
  removeReaction: (eventId: string, emoji: string) => Promise<void>;
  getReactions: (eventId: string) => Relations | null;
  
  // Replies & Threads
  replyToEvent: (eventId: string, text: string) => Promise<void>;
  getThread: (eventId: string) => Thread | undefined;
  
  // Read receipts
  sendReadReceipt: (eventId: string) => Promise<void>;
}
```

**Usage:**

```tsx
import { useTimeline } from '@xhub-chat/react';

function ChatRoom({ roomId }: { roomId: string }) {
  const {
    events,
    isLoading,
    sendTextMessage,
    canPaginateBackwards,
    paginate,
  } = useTimeline({ roomId });
  
  const [message, setMessage] = useState('');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {canPaginateBackwards && (
        <button onClick={() => paginate('b', 30)}>
          Load Older Messages
        </button>
      )}
      
      {events.map(event => (
        <Message key={event.getId()} event={event} />
      ))}
      
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={() => {
        sendTextMessage(message);
        setMessage('');
      }}>
        Send
      </button>
    </div>
  );
}
```

**Returns:**

#### Timeline Data
- `events` - Array of timeline events (auto-updates)
- `room` - Room object
- `isLoading` - Initial loading state
- `error` - Any error message

#### Pagination
- `canPaginateForwards` - Can load newer messages
- `canPaginateBackwards` - Can load older messages
- `isPaginatingForwards` - Currently loading newer
- `isPaginatingBackwards` - Currently loading older
- `paginate(direction, limit)` - Load more messages
  - `direction`: `'f'` (forwards) or `'b'` (backwards)
  - `limit`: Number of messages (default: 30)

#### Messaging
- `sendTextMessage(text)` - Send text message
- `sendMessage(content)` - Send custom content
- `resendEvent(eventId)` - Retry failed message
- `cancelPendingEvent(eventId)` - Cancel pending message

#### Reactions
- `addReaction(eventId, emoji)` - Add reaction
- `removeReaction(eventId, emoji)` - Remove reaction
- `getReactions(eventId)` - Get all reactions

#### Threading
- `replyToEvent(eventId, text)` - Reply to message
- `getThread(eventId)` - Get thread data

#### Read Receipts
- `sendReadReceipt(eventId)` - Mark as read

**Example - Complete Chat:**

```tsx
function CompleteChat({ roomId }: { roomId: string }) {
  const {
    events,
    sendTextMessage,
    addReaction,
    replyToEvent,
    paginate,
    canPaginateBackwards,
  } = useTimeline({ roomId });
  
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  
  const handleSend = async () => {
    if (!message.trim()) return;
    
    if (replyTo) {
      await replyToEvent(replyTo, message);
      setReplyTo(null);
    } else {
      await sendTextMessage(message);
    }
    
    setMessage('');
  };
  
  return (
    <div className="chat">
      <div className="messages">
        {canPaginateBackwards && (
          <button onClick={() => paginate('b')}>
            Load Older
          </button>
        )}
        
        {events.map(event => (
          <div key={event.getId()} className="message">
            <div className="content">
              {event.getContent().body}
            </div>
            
            <div className="actions">
              <button onClick={() => addReaction(event.getId(), '👍')}>
                👍
              </button>
              <button onClick={() => setReplyTo(event.getId())}>
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {replyTo && (
        <div className="reply-bar">
          Replying to message
          <button onClick={() => setReplyTo(null)}>Cancel</button>
        </div>
      )}
      
      <div className="input">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
```

**Example - Reactions:**

```tsx
function MessageWithReactions({ event }: { event: XHubChatEvent }) {
  const { getReactions, addReaction, removeReaction } = useTimeline({
    roomId: event.getRoomId()!,
  });
  
  const reactions = getReactions(event.getId());
  const reactionGroups = reactions?.getSortedAnnotationsByKey() || [];
  
  return (
    <div>
      <div>{event.getContent().body}</div>
      
      <div className="reactions">
        {reactionGroups.map(([emoji, events]) => (
          <button
            key={emoji}
            onClick={() => {
              const myReaction = events.find(
                e => e.getSender() === client.getUserId()
              );
              
              if (myReaction) {
                removeReaction(event.getId(), emoji);
              } else {
                addReaction(event.getId(), emoji);
              }
            }}
          >
            {emoji} {events.size}
          </button>
        ))}
        
        <button onClick={() => addReaction(event.getId(), '❤️')}>
          Add Reaction
        </button>
      </div>
    </div>
  );
}
```

---

## Utility Hooks

### Custom Hooks

You can create custom hooks by combining the core hooks:

**Example - useUnreadCount:**

```tsx
import { useEffect, useState } from 'react';
import { useXHubChat } from '@xhub-chat/react';
import { ClientEvent } from '@xhub-chat/core';

export function useUnreadCount(roomId: string): number {
  const { client, getRoom } = useXHubChat();
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const room = getRoom(roomId);
    if (!room) return;
    
    const updateCount = () => {
      setUnreadCount(room.getUnreadNotificationCount('total') || 0);
    };
    
    updateCount();
    
    client.on(ClientEvent.RoomTimeline, updateCount);
    
    return () => {
      client.off(ClientEvent.RoomTimeline, updateCount);
    };
  }, [client, roomId, getRoom]);
  
  return unreadCount;
}
```

**Example - useTypingIndicator:**

```tsx
import { useEffect, useState } from 'react';
import { useXHubChat } from '@xhub-chat/react';
import { RoomEvent } from '@xhub-chat/core';

export function useTypingIndicator(roomId: string): string[] {
  const { getRoom } = useXHubChat();
  const [typing, setTyping] = useState<string[]>([]);
  
  useEffect(() => {
    const room = getRoom(roomId);
    if (!room) return;
    
    const onTyping = () => {
      const members = room.getMembersWithMembership('join')
        .filter(m => m.typing && m.userId !== room.client.getUserId())
        .map(m => m.name);
      
      setTyping(members);
    };
    
    room.on(RoomEvent.Typing, onTyping);
    
    return () => {
      room.off(RoomEvent.Typing, onTyping);
    };
  }, [roomId, getRoom]);
  
  return typing;
}
```

**Example - useRoomMember:**

```tsx
import { useEffect, useState } from 'react';
import { useXHubChat } from '@xhub-chat/react';
import { RoomMember, RoomEvent } from '@xhub-chat/core';

export function useRoomMember(
  roomId: string,
  userId: string
): RoomMember | null {
  const { getRoom } = useXHubChat();
  const [member, setMember] = useState<RoomMember | null>(null);
  
  useEffect(() => {
    const room = getRoom(roomId);
    if (!room) return;
    
    const updateMember = () => {
      setMember(room.getMember(userId));
    };
    
    updateMember();
    
    room.on(RoomEvent.MembershipChanged, updateMember);
    
    return () => {
      room.off(RoomEvent.MembershipChanged, updateMember);
    };
  }, [roomId, userId, getRoom]);
  
  return member;
}
```

## Best Practices

### 1. Always Use Within Provider

```tsx
// ✅ Good
function App() {
  return (
    <XHubChatProvider config={config}>
      <ChatComponent />
    </XHubChatProvider>
  );
}

// ❌ Bad - will throw error
function App() {
  return <ChatComponent />; // No provider!
}
```

### 2. Memoize Callbacks

```tsx
// ✅ Good
const handleSend = useCallback(async () => {
  await sendTextMessage(message);
}, [sendTextMessage, message]);

// ❌ Bad - creates new function every render
const handleSend = async () => {
  await sendTextMessage(message);
};
```

### 3. Clean Up Event Listeners

```tsx
// ✅ Good
useEffect(() => {
  const onEvent = () => { /* ... */ };
  client.on(ClientEvent.Room, onEvent);
  
  return () => {
    client.off(ClientEvent.Room, onEvent);
  };
}, [client]);
```

### 4. Handle Loading States

```tsx
// ✅ Good
const { events, isLoading } = useTimeline({ roomId });

if (isLoading) {
  return <Spinner />;
}

// ❌ Bad - flashing content
const { events } = useTimeline({ roomId });
return <div>{events.length} messages</div>; // Shows 0 initially
```

## Type Safety

All hooks are fully typed. Use TypeScript for best experience:

```typescript
import type { XHubChatEvent, Room } from '@xhub-chat/core';

const { events }: { events: XHubChatEvent[] } = useTimeline({ roomId });
const { rooms }: { rooms: Room[] } = useRooms();
```

---

## Reels Hooks

### useMyReels

Fetch and manage the current user's own reels with filtering and pagination.

**Type Signature:**

```typescript
function useMyReels(options?: UseMyReelsOptions): UseMyReelsReturn

interface UseMyReelsOptions {
  autoLoad?: boolean;
  limit?: number;
  initialFilters?: MyReelsFilter;
}

interface MyReelsFilter {
  approving_status?: 'approved' | 'rejected' | 'pending';
  privacy?: number;
  sort?: string;
  sorted?: 'asc' | 'desc';
  cursor?: string;
  limit?: number;
}

interface UseMyReelsReturn {
  reels: ReelData[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  filters: MyReelsFilter;
  loadMore: () => Promise<void>;
  reload: (newFilters?: MyReelsFilter) => Promise<void>;
  setFilters: (newFilters: MyReelsFilter) => void;
}
```

**Usage:**

```tsx
import { useMyReels } from '@xhub-chat/react';

function MyReelsPage() {
  const { reels, loading, hasMore, loadMore } = useMyReels();

  return (
    <div>
      {reels.map(reel => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

**Parameters:**

- `options.autoLoad` - Auto-load reels on mount (default: `true`)
- `options.limit` - Number of items per page (default: `10`)
- `options.initialFilters` - Initial filter values

**Returns:**

- `reels` - Array of loaded reels
- `loading` - Loading state
- `error` - Error if any
- `hasMore` - Whether more reels are available
- `filters` - Current filter values
- `loadMore` - Load next page of reels
- `reload` - Reload from start with optional new filters
- `setFilters` - Update filters and trigger reload

**Example - With Filters:**

```tsx
function MyApprovedReels() {
  const { reels, setFilters } = useMyReels({
    initialFilters: { approving_status: 'approved' },
  });

  const showPending = () => {
    setFilters({ approving_status: 'pending' });
  };

  return (
    <div>
      <button onClick={showPending}>Show Pending</button>
      <ReelsList reels={reels} />
    </div>
  );
}
```

**Example - Manual Load:**

```tsx
function MyReelsManual() {
  const { reels, reload } = useMyReels({ autoLoad: false });

  return (
    <div>
      <button onClick={() => reload()}>Load My Reels</button>
      {reels.length > 0 && <ReelsList reels={reels} />}
    </div>
  );
}
```

**See Also:**

- [My Reels Guide](/docs/features/reels/my-reels) - Complete guide
- [fetchMyReels](/docs/api/reference#fetchmyreels) - Core API method

---

## Next Steps

- [📚 Using with React](/docs/guides/using-with-react) - Complete React guide
- [💡 API Reference](/docs/api/reference) - Core client API
- [🎨 Examples](/docs/examples/minimal-example) - Working examples
