---
sidebar_position: 1
title: Minimal Example
description: Simple, complete example of XHub Chat in action
---

# 💻 Minimal Example

A minimal, complete example showing how to build a basic chat application with XHub Chat.

## Complete Working Example

This example demonstrates:
- Setting up the provider
- Displaying a list of rooms
- Showing messages in a selected room
- Sending new messages

### Installation

```bash
pnpm add @xhub-chat/core @xhub-chat/react react react-dom
```

### Full Code

```tsx title="App.tsx"
import React, { useState } from 'react';
import { XHubChatProvider, useRooms, useTimeline } from '@xhub-chat/react';
import './App.css';

// Main App Component
export default function App() {
  return (
    <XHubChatProvider
      config={{
        baseUrl: 'https://api.example.com',
        accessToken: 'your-access-token',
        userId: '@user:example.com',
      }}
    >
      <ChatApp />
    </XHubChatProvider>
  );
}

// Chat Application
function ChatApp() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <RoomList onRoomSelect={setSelectedRoomId} />
      </aside>
      <main className="chat-main">
        {selectedRoomId ? (
          <ChatRoom roomId={selectedRoomId} />
        ) : (
          <div className="empty-state">
            <p>Select a room to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Room List Component
function RoomList({ onRoomSelect }: { onRoomSelect: (id: string) => void }) {
  const { rooms, loading, error } = useRooms();

  if (loading) return <div className="loading">Loading rooms...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="room-list">
      <h2>Rooms</h2>
      {rooms.map(room => (
        <button
          key={room.roomId}
          className="room-item"
          onClick={() => onRoomSelect(room.roomId)}
        >
          <div className="room-name">{room.name}</div>
          <div className="room-topic">{room.getTopic() || 'No topic'}</div>
        </button>
      ))}
    </div>
  );
}

// Chat Room Component
function ChatRoom({ roomId }: { roomId: string }) {
  const {
    events,
    sendTextMessage,
    isLoading,
    canPaginateBackwards,
    paginate
  } = useTimeline(roomId);

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      await sendTextMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return <div className="loading">Loading messages...</div>;

  return (
    <div className="chat-room">
      <div className="messages">
        {canPaginateBackwards && (
          <button 
            className="load-more"
            onClick={() => paginate('b')}
          >
            Load Older Messages
          </button>
        )}
        
        {events.map(event => (
          <div key={event.getId()} className="message">
            <div className="message-header">
              <span className="sender">{event.getSender()}</span>
              <span className="timestamp">
                {new Date(event.getTs()).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-body">
              {event.getContent().body}
            </div>
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && !sending && handleSend()}
          placeholder="Type a message..."
          disabled={sending}
        />
        <button 
          onClick={handleSend}
          disabled={sending || !message.trim()}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
```

### CSS Styles

```css title="App.css"
.chat-app {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.sidebar {
  width: 300px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.room-list {
  padding: 1rem;
}

.room-list h2 {
  margin-top: 0;
  font-size: 1.2rem;
}

.room-item {
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.room-item:hover {
  background: #e9e9e9;
}

.room-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.room-topic {
  font-size: 0.85rem;
  color: #666;
}

.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.load-more {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.sender {
  font-weight: 600;
  color: #6366f1;
}

.timestamp {
  color: #999;
}

.message-body {
  line-height: 1.5;
}

.message-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
  background: white;
}

.message-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.message-input button {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.message-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading, .error {
  padding: 2rem;
  text-align: center;
}

.error {
  color: #dc2626;
}
```

## Running the Example

1. **Install dependencies:**

```bash
pnpm install
```

2. **Update configuration:**

Replace `baseUrl`, `accessToken`, and `userId` with your actual values:

```tsx
<XHubChatProvider
  config={{
    baseUrl: 'https://your-server.com',
    accessToken: 'your-token',
    userId: '@youruser:yourdomain.com',
  }}
>
```

3. **Start the app:**

```bash
pnpm dev
```

## What's Happening?

### 1. Provider Setup

```tsx
<XHubChatProvider config={{ ... }}>
```

- Initializes the XHub Chat client
- Makes client available to all child components
- Handles connection and sync

### 2. Room List

```tsx
const { rooms, loading, error } = useRooms();
```

- Fetches all rooms the user has joined
- Automatically updates when rooms change
- Provides loading and error states

### 3. Message Display

```tsx
const { events, sendTextMessage } = useTimeline(roomId);
```

- Gets all messages for the selected room
- Automatically updates with new messages
- Provides pagination for older messages

### 4. Sending Messages

```tsx
await sendTextMessage(message);
```

- Sends message to the room
- Optimistic UI update (appears immediately)
- Retries on failure automatically

## Try It Yourself

Experiment with these modifications:

### Add Message Reactions

```tsx
import { useReactions } from '@xhub-chat/react';

function MessageWithReactions({ roomId, eventId }) {
  const { reactions, addReaction } = useReactions(roomId, eventId);
  
  return (
    <div>
      {/* ... message content ... */}
      <button onClick={() => addReaction('👍')}>👍</button>
    </div>
  );
}
```

### Add Typing Indicators

```tsx
function ChatRoom({ roomId }) {
  const client = useXHubChat();
  const [isTyping, setIsTyping] = useState(false);

  const handleTyping = () => {
    if (!isTyping) {
      client.sendTyping(roomId, true);
      setIsTyping(true);
      setTimeout(() => {
        client.sendTyping(roomId, false);
        setIsTyping(false);
      }, 3000);
    }
  };

  return (
    <input onChange={handleTyping} />
  );
}
```

### Add User Avatars

```tsx
function Message({ event }) {
  const sender = event.getSender();
  const avatarUrl = event.sender?.getMxcAvatarUrl();

  return (
    <div className="message">
      <img src={avatarUrl} alt={sender} className="avatar" />
      {/* ... rest of message ... */}
    </div>
  );
}
```

## Next Steps

- [📚 Using with React](/docs/guides/using-with-react) - Advanced patterns
- [🔧 Configuration](/docs/getting-started/requirements) - More options
- [💡 Core Concepts](/docs/core-concepts/overview) - Understand the architecture
- [📘 API Reference](/docs/api/hooks) - Full API documentation
