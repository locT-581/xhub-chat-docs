---
sidebar_position: 2
title: Send & Receive Messages
description: Gửi và nhận tin nhắn trong phòng chat
tags: [messaging, send, receive]
---

# 💬 Send & Receive Messages

Gửi tin nhắn văn bản và nhận tin nhắn real-time trong phòng chat.

## Core Package (@xhub-chat/core)

### Send Text Message

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

await client.startClient();

// Send a text message
const roomId = '!roomId:server.com';
const message = 'Hello, World!';

await client.sendTextMessage(roomId, message);
```

### Receive Messages

```typescript
import { RoomEvent } from '@xhub-chat/core';

const room = client.getRoom(roomId);

if (room) {
  // Listen for new messages
  room.on(RoomEvent.Timeline, (event, room, toStartOfTimeline) => {
    if (event.getType() === 'm.room.message' && !toStartOfTimeline) {
      console.log('New message:', {
        sender: event.getSender(),
        content: event.getContent().body,
        timestamp: event.getDate(),
      });
    }
  });
}
```

### Get Timeline Events

```typescript
// Get all messages in the room
const timeline = room.getLiveTimeline();
const events = timeline.getEvents();

events.forEach(event => {
  if (event.getType() === 'm.room.message') {
    console.log(event.getContent().body);
  }
});
```

### Pagination (Load More Messages)

```typescript
import { EventTimeline } from '@xhub-chat/core';

const timeline = room.getLiveTimeline();

// Load older messages
await client.paginateEventTimeline(timeline, {
  backwards: true,
  limit: 20,
});

// Get updated events
const allEvents = timeline.getEvents();
```

### Resend Failed Messages

```typescript
import { EventStatus } from '@xhub-chat/core';

// Find failed messages
const pendingEvents = room.getPendingEvents();
const failedEvent = pendingEvents.find(e => 
  e.status === EventStatus.NOT_SENT
);

if (failedEvent) {
  // Resend the event
  await client.resendEvent(failedEvent, room);
}
```

## React Package (@xhub-chat/react)

### Send Messages

```tsx
import { useXHubChat, useRoom } from '@xhub-chat/react';
import { useState } from 'react';

function MessageInput({ roomId }: { roomId: string }) {
  const client = useXHubChat();
  const room = useRoom(roomId);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!client || !message.trim()) return;

    setSending(true);
    try {
      await client.sendTextMessage(roomId, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={sending}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} disabled={sending}>
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
```

### Receive & Display Messages

```tsx
import { useTimeline } from '@xhub-chat/react';

function MessageList({ roomId }: { roomId: string }) {
  const { events, loading } = useTimeline(roomId);

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="message-list">
      {events.map(event => {
        if (event.getType() !== 'm.room.message') return null;

        return (
          <div key={event.getId()} className="message">
            <strong>{event.getSender()}</strong>
            <p>{event.getContent().body}</p>
            <time>{event.getDate()?.toLocaleString()}</time>
          </div>
        );
      })}
    </div>
  );
}
```

### Complete Chat Component

```tsx
import { useTimeline, useXHubChat } from '@xhub-chat/react';
import { useState, useRef, useEffect } from 'react';

function ChatRoom({ roomId }: { roomId: string }) {
  const client = useXHubChat();
  const { 
    events, 
    loading, 
    paginate, 
    canPaginateBackwards 
  } = useTimeline(roomId);
  
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !message.trim()) return;

    await client.sendTextMessage(roomId, message);
    setMessage('');
  };

  const loadMore = async () => {
    await paginate({ backwards: true, limit: 20 });
  };

  return (
    <div className="chat-room">
      {canPaginateBackwards && (
        <button onClick={loadMore}>Load older messages</button>
      )}

      <div className="messages">
        {events.map(event => (
          <Message key={event.getId()} event={event} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function Message({ event }: { event: XHubChatEvent }) {
  if (event.getType() !== 'm.room.message') return null;

  return (
    <div className="message">
      <strong>{event.getSender()}</strong>
      <p>{event.getContent().body}</p>
    </div>
  );
}
```

## API Reference

### Send Methods

- `sendTextMessage(roomId: string, text: string): Promise<void>`
- `resendEvent(event: XHubChatEvent, room: Room): Promise<void>`

### Timeline Methods

- `getLiveTimeline(): EventTimeline`
- `paginateEventTimeline(timeline, opts): Promise<boolean>`

### Event Properties

```typescript
interface XHubChatEvent {
  getId(): string;
  getType(): string;
  getSender(): string | null;
  getContent(): any;
  getDate(): Date | null;
  status: EventStatus;
}
```

[Back to Features](/docs/features/)
