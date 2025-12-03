---
sidebar_position: 1
title: React Package
description: Complete guide to @xhub-chat/react - React hooks and components
tags: [react, hooks, components, typescript]
---

# ⚛️ @xhub-chat/react

React bindings for XHub Chat with powerful hooks and components.

## Overview

`@xhub-chat/react` provides React-specific hooks and components built on top of `@xhub-chat/core`. It makes integrating real-time chat into React applications seamless and intuitive.

## Installation

```bash
# Install both core and react packages
pnpm add @xhub-chat/core @xhub-chat/react

# Using npm
npm install @xhub-chat/core @xhub-chat/react

# Using yarn
yarn add @xhub-chat/core @xhub-chat/react
```

## Quick Start

```tsx
import { XHubChatProvider, useRooms, useTimeline } from '@xhub-chat/react';

function App() {
  return (
    <XHubChatProvider
      config={{
        baseUrl: 'https://your-server.com',
        accessToken: 'your-token',
        userId: '@user:example.com',
      }}
    >
      <ChatApp />
    </XHubChatProvider>
  );
}

function ChatApp() {
  const { rooms } = useRooms();
  
  return (
    <div>
      {rooms.map(room => (
        <RoomItem key={room.roomId} roomId={room.roomId} />
      ))}
    </div>
  );
}

function RoomItem({ roomId }: { roomId: string }) {
  const { events, sendTextMessage } = useTimeline({ roomId });
  
  return (
    <div>
      {events.map(event => (
        <div key={event.getId()}>{event.getContent().body}</div>
      ))}
      <button onClick={() => sendTextMessage('Hello!')}>Send</button>
    </div>
  );
}
```

## Core Features

### 🪝 Powerful Hooks

**Messaging & Rooms:**
- `useXHubChat` - Access client and core functionality
- `useRooms` - Manage room lists with pagination
- `useTimeline` - Handle messages and timeline
- `useReactions` - Manage message reactions
- `useThread` - Handle threaded messages
- `useTyping` - Track typing indicators
- `usePresence` - Monitor user presence

**Reels (Short-form Videos):**
- `useReelsFeed` - TikTok-style infinite scroll feed
- `useReelRoom` - Get Room instance for a reel
- `useReelComments` - Manage reel comments
- `useMyReels` - Fetch and manage user's own reels

**Posts:**
- `usePost` - Post data and interactions
- `usePostComments` - Post comments management

### 🎨 Provider System

- Context-based architecture
- Automatic state management
- Type-safe APIs
- SSR compatible

### ⚡ Auto Re-rendering

- Automatic updates on changes
- Optimized re-render performance
- Selective subscriptions
- Memoization built-in

## Package Structure

```
@xhub-chat/react/
├── index.ts
├── context/
│   └── XHubChatContext.tsx
├── hooks/
│   ├── useXHubChat.ts
│   ├── useRooms.ts
│   ├── useTimeline.ts
│   └── ...
└── utils/
    └── reply.ts
```

## Documentation Sections

<div className="row" style={{ marginTop: '2rem' }}>
  <div className="col col--6">
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <h3>🪝 Hooks API</h3>
      <p>Complete documentation for all React hooks</p>
      <a href="/docs/packages/react/hooks" className="button button--primary button--sm">
        View Hooks →
      </a>
    </div>
  </div>
  
  <div className="col col--6">
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
      <h3>📚 Guides</h3>
      <p>Integration guides and best practices</p>
      <a href="/docs/packages/react/guides/provider" className="button button--primary button--sm">
        Read Guides →
      </a>
    </div>
  </div>
</div>

## Core Hooks

### useXHubChat

Access the client and core functionality:

```tsx
import { useXHubChat } from '@xhub-chat/react';

function Component() {
  const { client, rooms, getRoom } = useXHubChat();
  
  return <div>Total rooms: {rooms.length}</div>;
}
```

[Full Hook Documentation](/docs/api/hooks#usexhubchat)

### useRooms

Manage room lists with pagination:

```tsx
import { useRooms } from '@xhub-chat/react';

function RoomList() {
  const {
    rooms,
    canPaginate,
    paginate,
    fetching,
  } = useRooms();
  
  return (
    <div>
      {rooms.map(room => <RoomItem key={room.roomId} room={room} />)}
      {canPaginate && (
        <button onClick={() => paginate(20)} disabled={fetching}>
          Load More
        </button>
      )}
    </div>
  );
}
```

[Full Hook Documentation](/docs/api/hooks#userooms)

### useTimeline

Handle messages and timeline events:

```tsx
import { useTimeline } from '@xhub-chat/react';

function ChatRoom({ roomId }: { roomId: string }) {
  const {
    events,
    isLoading,
    sendTextMessage,
    addReaction,
    canPaginateBackwards,
    paginate,
  } = useTimeline({ roomId });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {canPaginateBackwards && (
        <button onClick={() => paginate('b')}>Load Older</button>
      )}
      
      {events.map(event => (
        <div key={event.getId()}>
          {event.getContent().body}
          <button onClick={() => addReaction(event.getId(), '👍')}>
            👍
          </button>
        </div>
      ))}
      
      <input onKeyPress={(e) => {
        if (e.key === 'Enter') {
          sendTextMessage(e.currentTarget.value);
          e.currentTarget.value = '';
        }
      }} />
    </div>
  );
}
```

[Full Hook Documentation](/docs/api/hooks#usetimeline)

## Provider Configuration

```tsx
interface XHubChatConfig {
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
  
  // Callbacks
  onSyncStateChange?: (state: string) => void
  onError?: (error: Error) => void
}
```

Example:

```tsx
<XHubChatProvider
  config={{
    baseUrl: 'https://your-server.com',
    accessToken: 'token',
    userId: '@user:server.com',
    store: {
      type: 'indexeddb',
      dbName: 'my-chat-app',
      workerApi: true,
    },
    onSyncStateChange: (state) => {
      console.log('Sync state:', state);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  }}
>
  <App />
</XHubChatProvider>
```

## Examples

### Complete Chat Application

```tsx
import {
  XHubChatProvider,
  useRooms,
  useTimeline,
} from '@xhub-chat/react';
import { useState } from 'react';

function App() {
  return (
    <XHubChatProvider config={{ /* ... */ }}>
      <ChatApp />
    </XHubChatProvider>
  );
}

function ChatApp() {
  const { rooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  return (
    <div className="chat-app">
      <aside>
        {rooms.map(room => (
          <button
            key={room.roomId}
            onClick={() => setSelectedRoom(room.roomId)}
          >
            {room.name}
          </button>
        ))}
      </aside>
      
      <main>
        {selectedRoom ? (
          <ChatRoom roomId={selectedRoom} />
        ) : (
          <div>Select a room</div>
        )}
      </main>
    </div>
  );
}

function ChatRoom({ roomId }: { roomId: string }) {
  const { events, sendTextMessage } = useTimeline({ roomId });
  const [message, setMessage] = useState('');
  
  return (
    <div>
      <div className="messages">
        {events.map(event => (
          <div key={event.getId()}>
            <strong>{event.getSender()}</strong>: {event.getContent().body}
          </div>
        ))}
      </div>
      
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            sendTextMessage(message);
            setMessage('');
          }
        }}
      />
    </div>
  );
}
```

### With Next.js

```tsx
// app/providers.tsx
'use client';

import { XHubChatProvider } from '@xhub-chat/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <XHubChatProvider
      config={{
        baseUrl: process.env.NEXT_PUBLIC_CHAT_URL!,
        accessToken: getAccessToken(),
        userId: getUserId(),
      }}
    >
      {children}
    </XHubChatProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Custom Hook

```tsx
import { useXHubChat } from '@xhub-chat/react';
import { useEffect, useState } from 'react';

export function useUnreadCount(roomId: string): number {
  const { getRoom } = useXHubChat();
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const room = getRoom(roomId);
    if (!room) return;
    
    const updateCount = () => {
      setCount(room.getUnreadNotificationCount('total') || 0);
    };
    
    updateCount();
    room.on('Room.timeline', updateCount);
    
    return () => {
      room.off('Room.timeline', updateCount);
    };
  }, [roomId, getRoom]);
  
  return count;
}
```

## TypeScript Support

Full TypeScript support with type inference:

```tsx
import type {
  XHubChatContextValue,
  IUseRooms,
  IUseTimeline,
} from '@xhub-chat/react';

const context: XHubChatContextValue = useXHubChat();
const rooms: IUseRooms = useRooms();
const timeline: IUseTimeline = useTimeline({ roomId });
```

## React Versions

- ✅ React 18.x
- ✅ React 19.x
- ✅ Next.js 13+ (App Router)
- ✅ Next.js 12+ (Pages Router)
- ⚠️ React 17.x (limited support)

## SSR Support

Works with all major React frameworks:

- ✅ Next.js (App Router & Pages Router)
- ✅ Remix
- ✅ Gatsby
- ✅ Create React App
- ✅ Vite

## Next Steps

<div className="row" style={{ marginTop: '2rem' }}>
  <div className="col col--4">
    <h4>🪝 Hooks</h4>
    <ul style={{ paddingLeft: '1.5rem' }}>
      <li><a href="/docs/packages/react/hooks">All Hooks</a></li>
      <li><a href="/docs/api/hooks">API Reference</a></li>
      <li><a href="/docs/guides/using-with-react">React Guide</a></li>
    </ul>
  </div>
  
  <div className="col col--4">
    <h4>📚 Guides</h4>
    <ul style={{ paddingLeft: '1.5rem' }}>
      <li><a href="/docs/packages/react/guides/provider">Provider Setup</a></li>
      <li><a href="/docs/packages/react/guides/state-management">State Management</a></li>
      <li><a href="/docs/packages/react/guides/nextjs">Next.js Integration</a></li>
    </ul>
  </div>
  
  <div className="col col--4">
    <h4>💡 Examples</h4>
    <ul style={{ paddingLeft: '1.5rem' }}>
      <li><a href="/docs/examples/minimal-example">Minimal Example</a></li>
      <li><a href="/docs/examples/custom-provider">Custom Provider</a></li>
      <li><a href="/docs/examples/full-app">Full Application</a></li>
    </ul>
  </div>
</div>
