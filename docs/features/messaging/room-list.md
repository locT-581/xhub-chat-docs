---
sidebar_position: 1
title: Room List
description: Hiển thị danh sách các phòng chat
tags: [messaging, rooms, list]
---

# 📋 Room List

Hiển thị danh sách tất cả các phòng chat mà người dùng tham gia.

## Core Package (@xhub-chat/core)

### Basic Usage

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

await client.startClient();

// Get all rooms
const rooms = client.getRooms();

rooms.forEach(room => {
  console.log('Room:', {
    id: room.roomId,
    name: room.name,
    unreadCount: room.getUnreadNotificationCount(),
  });
});
```

### Advanced: Filter Rooms by Category

```typescript
// Filter chat rooms only
const chatRooms = client.getRooms().filter(room => 
  room.getCategory() === 'chat_room'
);

// Filter post rooms only
const postRooms = client.getRooms().filter(room => 
  room.getCategory() === 'post'
);
```

### Listen to Room Updates

```typescript
import { ClientEvent } from '@xhub-chat/core';

client.on(ClientEvent.Room, (room) => {
  console.log('New room added:', room.name);
  // Update your UI with the new room
});
```

### Paginate Rooms

```typescript
// Load initial rooms
await client.loadRoomList();

// Load more rooms
await client.paginateRooms({ limit: 20 });
```

## React Package (@xhub-chat/react)

### Basic Usage

```tsx
import { useRooms } from '@xhub-chat/react';

function RoomList() {
  const rooms = useRooms();

  return (
    <div>
      <h2>My Rooms</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.roomId}>
            {room.name}
            {room.getUnreadNotificationCount() > 0 && (
              <span className="badge">
                {room.getUnreadNotificationCount()}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Advanced: Filter and Sort

```tsx
import { useRooms } from '@xhub-chat/react';
import { useMemo } from 'react';

function RoomList() {
  const rooms = useRooms();

  // Filter chat rooms only
  const chatRooms = useMemo(() => 
    rooms.filter(room => room.getCategory() === 'chat_room'),
    [rooms]
  );

  // Sort by unread count
  const sortedRooms = useMemo(() =>
    [...chatRooms].sort((a, b) => 
      b.getUnreadNotificationCount() - a.getUnreadNotificationCount()
    ),
    [chatRooms]
  );

  return (
    <ul>
      {sortedRooms.map(room => (
        <li key={room.roomId}>{room.name}</li>
      ))}
    </ul>
  );
}
```

### With Loading State

```tsx
import { useRooms, useXHubChat } from '@xhub-chat/react';
import { useState, useEffect } from 'react';

function RoomList() {
  const client = useXHubChat();
  const rooms = useRooms();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (client) {
      client.loadRoomList().finally(() => setLoading(false));
    }
  }, [client]);

  if (loading) return <div>Loading rooms...</div>;

  return (
    <ul>
      {rooms.map(room => (
        <li key={room.roomId}>{room.name}</li>
      ))}
    </ul>
  );
}
```

## API Reference

### Room Properties

```typescript
interface Room {
  roomId: string;
  name: string;
  getCategory(): 'chat_room' | 'post' | undefined;
  getUnreadNotificationCount(): number;
  getLiveTimeline(): EventTimeline;
}
```

### Client Methods

- `getRooms(): Room[]` - Get all rooms
- `getRoom(roomId: string): Room | null` - Get specific room
- `loadRoomList(): Promise<void>` - Load room list
- `paginateRooms({ limit }): Promise<void>` - Load more rooms

[Back to Features](/docs/features/)
