---
sidebar_position: 1
title: Using with React
description: Complete guide to using XHub Chat in React applications
---

# ⚛️ Using XHub Chat with React

Complete guide to integrating XHub Chat into your React applications.

## Prerequisites

- React 18.0 or 19.0
- Node.js 18+
- Basic understanding of React Hooks

## Installation

```bash
pnpm add @xhub-chat/core @xhub-chat/react
```

## Basic Setup

### 1. Provider Configuration

Wrap your app with `XHubChatProvider`:

```tsx title="src/App.tsx"
import { XHubChatProvider } from '@xhub-chat/react';

function App() {
  return (
    <XHubChatProvider
      config={{
        baseUrl: 'https://api.example.com',
        accessToken: getUserToken(),
        userId: getCurrentUserId(),
      }}
    >
      <ChatApplication />
    </XHubChatProvider>
  );
}
```

### 2. Building a Room List

```tsx title="src/components/RoomList.tsx"
import { useRooms } from '@xhub-chat/react';

export function RoomList() {
  const { rooms, loading, error } = useRooms();

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="room-list">
      {rooms.map(room => (
        <RoomCard key={room.roomId} room={room} />
      ))}
    </div>
  );
}
```

### 3. Displaying Messages

```tsx title="src/components/ChatRoom.tsx"
import { useRoom } from '@xhub-chat/react';

export function ChatRoom({ roomId }: { roomId: string }) {
  const { room, events, isLoading, canPaginateBackwards, paginate } = useRoom(roomId);

  if (isLoading) return <div>Loading messages...</div>;

  return (
    <div className="chat-room">
      <h2>{room?.name}</h2>
      
      {canPaginateBackwards && (
        <button onClick={() => paginate('b')}>
          Load Older Messages
        </button>
      )}

      <div className="messages">
        {events.map(event => (
          <Message key={event.getId()} event={event} />
        ))}
      </div>
    </div>
  );
}
```

### 4. Sending Messages

```tsx title="src/components/MessageInput.tsx"
import { useState } from 'react';
import { useTimeline } from '@xhub-chat/react';

export function MessageInput({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState('');
  const { sendTextMessage } = useTimeline(roomId);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      await sendTextMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send:', error);
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

## Advanced Patterns

### Infinite Scroll Pagination

```tsx
import { useRef, useEffect } from 'react';
import { useRoom } from '@xhub-chat/react';

export function InfiniteScrollChat({ roomId }: { roomId: string }) {
  const {
    events,
    canPaginateBackwards,
    isPaginatingBackwards,
    paginate
  } = useRoom(roomId);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && canPaginateBackwards && !isPaginatingBackwards) {
          paginate('b');
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = scrollRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [canPaginateBackwards, isPaginatingBackwards, paginate]);

  return (
    <div className="chat-container">
      <div ref={scrollRef} className="load-more-sentinel" />
      {isPaginatingBackwards && <LoadingSpinner />}
      
      {events.map(event => (
        <MessageItem key={event.getId()} event={event} />
      ))}
    </div>
  );
}
```

### Message Reactions

```tsx
import { useReactions } from '@xhub-chat/react';

export function MessageWithReactions({
  roomId,
  eventId
}: {
  roomId: string;
  eventId: string;
}) {
  const { reactions, addReaction, removeReaction } = useReactions(roomId, eventId);

  return (
    <div className="reactions">
      {Array.from(reactions.entries()).map(([emoji, users]) => (
        <button
          key={emoji}
          onClick={() => removeReaction(emoji)}
          className={users.includes(myUserId) ? 'reacted' : ''}
        >
          {emoji} {users.length}
        </button>
      ))}
      
      <EmojiPicker onSelect={emoji => addReaction(emoji)} />
    </div>
  );
}
```

### Threaded Conversations

```tsx
import { useThread } from '@xhub-chat/react';

export function ThreadView({
  roomId,
  threadRootId
}: {
  roomId: string;
  threadRootId: string;
}) {
  const { events, sendTextMessage, isLoading } = useThread(roomId, threadRootId);

  if (isLoading) return <div>Loading thread...</div>;

  return (
    <div className="thread">
      <h3>Thread</h3>
      {events.map(event => (
        <ThreadMessage key={event.getId()} event={event} />
      ))}
      <MessageInput onSend={sendTextMessage} />
    </div>
  );
}
```

### Custom Hooks

Create reusable custom hooks for your specific needs:

```tsx
import { useMemo } from 'react';
import { useRoom } from '@xhub-chat/react';

export function useChatRoom(roomId: string) {
  const roomData = useRoom(roomId);
  
  // Group messages by date
  const messagesByDate = useMemo(() => {
    const groups = new Map<string, typeof roomData.events>();
    
    roomData.events.forEach(event => {
      const date = new Date(event.getTs()).toLocaleDateString();
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(event);
    });
    
    return groups;
  }, [roomData.events]);

  return {
    ...roomData,
    messagesByDate,
  };
}
```

## Integration with Next.js

### App Router (Next.js 13+)

```tsx title="app/chat/layout.tsx"
'use client';

import { XHubChatProvider } from '@xhub-chat/react';

export default function ChatLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <XHubChatProvider
      config={{
        baseUrl: process.env.NEXT_PUBLIC_CHAT_API!,
        accessToken: getToken(),
      }}
    >
      {children}
    </XHubChatProvider>
  );
}
```

```tsx title="app/chat/[roomId]/page.tsx"
'use client';

import { useRoom } from '@xhub-chat/react';

export default function RoomPage({
  params
}: {
  params: { roomId: string };
}) {
  const { events } = useRoom(params.roomId);
  
  return <ChatRoom events={events} />;
}
```

### Pages Router (Next.js 12)

```tsx title="pages/_app.tsx"
import type { AppProps } from 'next/app';
import { XHubChatProvider } from '@xhub-chat/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <XHubChatProvider config={chatConfig}>
      <Component {...pageProps} />
    </XHubChatProvider>
  );
}
```

## State Management

### With Context API

```tsx
import { createContext, useContext } from 'react';
import { useRooms } from '@xhub-chat/react';

const ChatContext = createContext<ReturnType<typeof useRooms> | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const rooms = useRooms();
  
  return (
    <ChatContext.Provider value={rooms}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used within ChatProvider');
  return context;
}
```

### With Zustand

```tsx
import create from 'zustand';
import { useRooms } from '@xhub-chat/react';

interface ChatStore {
  selectedRoomId: string | null;
  setSelectedRoom: (roomId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedRoomId: null,
  setSelectedRoom: (roomId) => set({ selectedRoomId: roomId }),
}));

// Usage
function ChatApp() {
  const { rooms } = useRooms();
  const { selectedRoomId, setSelectedRoom } = useChatStore();
  
  return (
    <>
      <RoomList rooms={rooms} onSelect={setSelectedRoom} />
      {selectedRoomId && <ChatRoom roomId={selectedRoomId} />}
    </>
  );
}
```

## Performance Optimization

### Memoization

```tsx
import { memo, useMemo } from 'react';

export const MessageItem = memo(({ event }: { event: XHubChatEvent }) => {
  const content = useMemo(() => event.getContent(), [event]);
  const timestamp = useMemo(() => new Date(event.getTs()), [event]);
  
  return (
    <div className="message">
      <div>{content.body}</div>
      <time>{timestamp.toLocaleString()}</time>
    </div>
  );
});
```

### Virtual Scrolling

Use libraries like `react-window` for large message lists:

```tsx
import { FixedSizeList } from 'react-window';
import { useRoom } from '@xhub-chat/react';

export function VirtualMessageList({ roomId }: { roomId: string }) {
  const { events } = useRoom(roomId);

  return (
    <FixedSizeList
      height={600}
      itemCount={events.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <MessageItem event={events[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

## Error Handling

### Error Boundaries

```tsx
import { Component, ReactNode } from 'react';

class ChatErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chat error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh.</div>;
    }

    return this.props.children;
  }
}

// Usage
<ChatErrorBoundary>
  <ChatRoom roomId={roomId} />
</ChatErrorBoundary>
```

## Testing

### Unit Testing with Jest

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useRooms } from '@xhub-chat/react';

test('useRooms returns rooms', async () => {
  const { result } = renderHook(() => useRooms(), {
    wrapper: TestXHubChatProvider,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.rooms).toHaveLength(3);
});
```

## Best Practices

1. **Always wrap with Provider**: Ensure `XHubChatProvider` is at the root
2. **Handle loading states**: Show loading indicators for better UX
3. **Error handling**: Always handle errors from async operations
4. **Memoization**: Use `React.memo` and `useMemo` for expensive renders
5. **Cleanup**: Hooks automatically clean up, but manually remove custom listeners
6. **Pagination**: Implement pagination for rooms with many messages
7. **Optimistic UI**: Embrace optimistic updates for instant feedback

## Next Steps

- [📘 API Reference](/docs/api/hooks) - Detailed hook documentation
- [💡 Core Concepts](/docs/core-concepts/overview) - Understanding the architecture
- [💻 Examples](/docs/examples/minimal-example) - More code examples
