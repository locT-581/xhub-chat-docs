---
sidebar_position: 2
title: Quick Start
description: Build your first chat application with XHub Chat in 5 minutes
---

# 🚀 Quick Start

Learn how to build your first real-time chat application with XHub Chat in just a few minutes.

## Overview

In this guide, you'll learn how to:

1. Set up the XHub Chat client with Provider
2. Display rooms with unread counts
3. Show messages with pagination
4. Send and receive messages in real-time
5. Handle reactions and threads

:::tip Estimated Time
⏱️ This guide takes approximately **10 minutes** to complete.
:::

## --Note--

1. Tất cả message được xem là 1 đối tượng event `XHubChatEvent`. Để lấy thông tin từ message xem các api trong đối tượng `XHubChatEvent`
2. Mỗi room sẽ có 1 **timeline-set** chứa nhiều timeline nhỏ, mỗi **timeline** sẽ chứa các event (message, reaction, etc..)
3. Room sẽ có 2 dạng là phòng chat và bài post, mỗi dạng sẽ có UI và tính năng khác nhau tuỳ theo mục đích sử dụng, sử dụng thuộc tính `room.roomData.category` để phân biệt. Các tính năng like/unlike chỉ thực hiện được trong các phòng là bài Post.
4. Sử dụng `goIntoRoom()` trong đối tượng `room` khi vào phòng để đánh dấu đã đọc, sử dụng `goOutRoom()` khi rời phòng để cập nhật trạng thái online/offline. **Bắt buộc**
5. Khi tải danh sách các phòng thì các tin nhắn trong phòng chưa được load, chỉ có 1 tin nhắn cuối cùng trong phòng, khi nào cần load thêm tin nhắn thì cần gọi hàm `paginate` trong `useTimeline` để load tin nhắn trong phòng đó.

## Step 1: Install Packages

First, install the required packages:

```bash
pnpm add @xhub-chat/react
```

If needed, also install core package:

```bash
pnpm add @xhub-chat/core
```

## Step 2: Create Provider Wrapper

Create a provider component that wraps the SDK provider with your configuration:

```tsx title="src/components/providers/XHubChatProvider.tsx"
import type { ICreateClientOpts } from '@xhub-chat/react';
import { XHubChatProvider as XHubChatProviderSDK } from '@xhub-chat/react';

export default function XHubChatProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const clientOptions: ICreateClientOpts = {
    clientParams: { api_key: 'YOUR_API_KEY' },
    baseUrl: 'https://your-server.com/',
    realtime: {
      channels: ['online:index', `user:YOUR_USER_ID`],
      url: 'wss://your-websocket-server.com/connection/websocket',
      token: 'YOUR_REALTIME_TOKEN', // <- YOUR_ACCESS_TOKEN
    },
    userId: 'YOUR_USER_ID',
    deviceId: 'YOUR_DEVICE_ID',
    accessToken: 'YOUR_ACCESS_TOKEN',
  };

  return (
    <XHubChatProviderSDK
      workerFactory={indexeddbWorkerFactory} // (Optional) Enable IndexedDB for offline support
      clientOptions={clientOptions}
      startOptions={{ initialSyncLimit: 10 }}
    >
      {children}
    </XHubChatProviderSDK>
  );
}
```

:::info Configuration
See the [Configuration Guide](/docs/getting-started/requirements) for all available options.
:::

## Step 3: Display Rooms with Unread Counts

Create a component to display chat rooms with unread message badges:

```tsx title="src/components/RoomList.tsx"
import { useRooms } from '@xhub-chat/react';
import type { Room } from '@xhub-chat/react';

interface RoomListProps {
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

export function RoomList({ selectedRoomId, onRoomSelect }: RoomListProps) {
  const { rooms, canPaginate, paginate, fetching } = useRooms();

  if (rooms.length === 0) {
    return <p>Loading rooms...</p>;
  }

  return (
    <div className="rooms-list">
      {rooms.map((room) => (
        <button
          key={room.roomId}
          className={`room-item ${selectedRoomId === room.roomId ? 'selected' : ''}`}
          onClick={() => {
            onRoomSelect(room.roomId);
            // Mark room as entered
            room.goIntoRoom();
          }}
        >
          <div className="room-name">{room.name || room.roomId}</div>
          <div className="room-meta">
            {room.summary?.getDescription()}
          </div>

          {/* Unread badge */}
          {room.getUnreadNotificationCount() > 0 && (
            <div className="unread-badge">
              {room.getUnreadNotificationCount()}
            </div>
          )}
        </button>
      ))}

      {/* Load more rooms */}
      {canPaginate && (
        fetching ? (
          <span className="loader" />
        ) : (
          <button onClick={() => paginate(20)}>Load More Rooms</button>
        )
      )}
    </div>
  );
}
```

## Step 4: Display Messages with Pagination, Send message

Show messages from a room with pagination and reactions:

```tsx title="src/components/MessageList.tsx"
import { useTimeline, Direction } from '@xhub-chat/react';
import type { Room, XHubChatEvent } from '@xhub-chat/react';
import { Message } from './Message';

interface MessageListProps {
  room: Room;
  onReply: (event: XHubChatEvent) => void;
}

export function MessageList({ room, onReply }: MessageListProps) {
  const {
    events,
    paginate,
    reactEvent,
    sendTextMessage,
    canPaginateBackwards,
    isPaginatingBackwards,
    getReactionsWithReactionsType,
  } = useTimeline({ 
    roomId: room.roomId, 
    timelineSet: room.getUnfilteredTimelineSet() 
  });

  /** Messages in room not load when load room, need first call to get message in room */
  useEffect(() => {
    if (events.length > 0 && events.length < 20) {
      paginate(Direction.Backward, 50, true, 50, true);
    }
  }, [events, paginate]);

  return (
    <div className="messages-list">
      {/* Sort messages by timestamp (newest at bottom) */}
      {events
        .sort((a, b) => b.getTs() - a.getTs())
        .map((event) => (
          <Message
            key={event.id}
            event={event}
            onReply={onReply}
            onReact={reactEvent}
            reactions={getReactionsWithReactionsType(event)}
          />
        ))}

      {/* Load older messages */}
      {canPaginateBackwards && (
        isPaginatingBackwards ? (
          <span className="loader" />
        ) : (
          <button onClick={() => paginate(Direction.Backward, 50, true, 50)}>
            Load More Messages
          </button>
        )
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendTextMessage(null, null, textValue);
        }}
      >
        <input
          value={textValue}
          onChange={e => setTextValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## Step 5: Create Message Component

Build a message component with reactions and thread support:

```tsx title="src/components/Message.tsx"
import type { Relations, XHubChatEvent } from '@xhub-chat/react';
import { useReactions, useThread, useXHubChat } from '@xhub-chat/react';

interface MessageProps {
  event: XHubChatEvent;
  onReply?: (event: XHubChatEvent) => void;
  onReact?: (reaction: string, event: XHubChatEvent) => void;
  reactions: Relations | null;
}

export function Message({ event, onReply, onReact, reactions }: MessageProps) {
  const { client } = useXHubChat();
  const { total } = useThread({ event, client: client ?? undefined });
  const { myReactions, getTotalReactions } = useReactions({ reactions });

  const isOwner = event.sender?.userId === client?.getUserId();
  const totalReactions = getTotalReactions()?.reduce(
    (acc, curr) => acc + curr.count, 
    0
  ) || 0;

  return (
    <div
      className={`message ${isOwner ? 'message-own' : ''}`}
      onClick={() => onReply?.(event)}
    >
      <div className="message-sender">
        {event.sender?.user?.displayName}
      </div>
      <div className="message-content">
        {event.getContent()?.text || '[No content]'}
      </div>
      <div className="message-footer">
        <span className="message-time">
          {new Date(event.getTs()).toLocaleString()}
        </span>
        
        {/* Reaction button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReact?.('❤️', event);
          }}
          className="reaction-button"
        >
          {myReactions?.length ? '❤️' : '🤍'} {totalReactions}
        </button>

        {/* Sending status */}
        {event.getAssociatedStatus() === EventStatus.SENDING && <span className="loader"/>}
      </div>
    </div>
  );
}
```

## Step 6: Get contacts and create direct message room

```tsx title="src/components/ContactList.tsx"
import { useContacts } from '@xhub-chat/react';

export default function ContactList() {
  const { contacts, createDirectRoomWithContact } = useContacts();

  return (
    <div className="status-card" style={{ width: '20%', height: '100%', overflowY: 'auto' }}>
      <h3>Contacts</h3>
      {contacts.map(contact => (
        <div
          onClick={async () => {
            const room = await createDirectRoomWithContact(contact.channel_slug);
            // Do something with the created room (navigate to it, etc.)
          }}
        >
          <div className="contact-name">{contact.displayName}</div>
          <div className="contact-presence" style={{ fontSize: 12, color: '#a7a7a7ff' }}>
            {contact.isOnline() ? 'Online' : 'Offline'}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 🎉 Congratulations

You've successfully created a full-featured chat application with XHub Chat! Your app now supports:

- ✅ Display chat rooms with unread counts
- ✅ Real-time message updates
- ✅ Message pagination (load older messages)
- ✅ Send and receive messages
- ✅ Reply to messages (threads)
- ✅ Reactions (like/unlike messages)
- ✅ Room pagination (load more rooms)

## 📚 Next Steps

Now that you have a working chat application, you can:

- [Explore all Features](/docs/features/) - Learn about posts, comments, and more
- [Read the API Reference](/docs/api/reference) - Discover all available methods
- [Check out Advanced Guides](/docs/advanced/architecture-deep-dive) - Deep dive into architecture
- [View Complete Examples](/docs/examples/full-app) - See production-ready implementations

## 💡 Tips

- Use `goIntoRoom()` when entering a room to mark it as read
- Use `goOutRoom()` when leaving to update presence
- Enable `workerFactory` for better performance with IndexedDB
- Set `initialSyncLimit` to control how many rooms load initially
- Use `Direction.Backward` for loading older messages

:::tip Complete Code
The complete working code is available in the [playground app](https://github.com/XHub-Platform/xhub-chat/tree/main/apps/playground) on GitHub.
:::
- ✅ Show messages in a room
- ✅ Send new messages
- ✅ Load more messages with pagination

## What's Next?

Now that you have a working chat app, explore more features:

### Essential Features

- [🔐 Authentication](/docs/guides/integration-examples) - Secure your chat app
- [💬 Message Reactions](/docs/api/hooks#usereactions) - Add emoji reactions
- [🧵 Message Threading](/docs/api/hooks#usethread) - Support threaded conversations
- [📎 File Attachments](/docs/guides/using-with-react) - Send images and files

### Advanced Topics

- [🔌 Event System](/docs/core-concepts/architecture) - Listen to real-time events
- [💾 Offline Support](/docs/advanced/architecture-deep-dive) - IndexedDB caching
- [⚡ Performance Optimization](/docs/guides/performance-tips) - Best practices

### API Reference

- [📘 React Hooks API](/docs/api/hooks) - Complete hook reference
- [📗 Core API](/docs/api/reference) - Client methods and classes
- [📙 Type Definitions](/docs/api/reference) - TypeScript types

## Need Help?

- 📖 Read the [Core Concepts](/docs/core-concepts/overview)
- 💡 Check out [Examples](/docs/examples/minimal-example)
- 🐛 [Report an issue](https://github.com/XHub-Platform/xhub-chat/issues)
- 💬 [Ask a question](https://github.com/XHub-Platform/xhub-chat/discussions)
