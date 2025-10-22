---
sidebar_position: 3
title: Unread Count
description: Đếm số tin nhắn chưa đọc
tags: [messaging, unread, notification]
---

# 🔔 Unread Message Count

Hiển thị số lượng tin nhắn chưa đọc cho mỗi phòng chat.

## Core Package (@xhub-chat/core)

### Get Unread Count

```typescript
import { createClient, NotificationCountType } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

const room = client.getRoom(roomId);

if (room) {
  // Get total unread count
  const totalUnread = room.getUnreadNotificationCount();
  console.log(`Total unread: ${totalUnread}`);

  // Get highlight count (mentions)
  const highlights = room.getUnreadNotificationCount(
    NotificationCountType.Highlight
  );
  console.log(`Mentions: ${highlights}`);
}
```

### Listen to Unread Updates

```typescript
import { RoomEvent } from '@xhub-chat/core';

room.on(RoomEvent.UnreadNotifications, (notificationCounts) => {
  console.log('Unread count changed:', {
    total: notificationCounts.total,
    highlight: notificationCounts.highlight,
  });
  // Update your UI badge
});
```

### Reset Unread Count

```typescript
// Mark room as read (usually done when user enters room)
room.goIntoRoom();

// Manually set unread count to 0
room.setUnreadNotificationCount(NotificationCountType.Total, 0);
```

### Total Unread Across All Rooms

```typescript
const totalUnread = client.getRooms().reduce((sum, room) => {
  return sum + room.getUnreadNotificationCount();
}, 0);

console.log(`Total unread messages: ${totalUnread}`);
```

### Filter Rooms with Unread Messages

```typescript
const roomsWithUnread = client.getRooms().filter(room => 
  room.getUnreadNotificationCount() > 0
);

console.log(`${roomsWithUnread.length} rooms have unread messages`);
```

## React Package (@xhub-chat/react)

### Display Unread Badge

```tsx
import { useRooms } from '@xhub-chat/react';

function RoomList() {
  const rooms = useRooms();

  return (
    <ul>
      {rooms.map(room => {
        const unreadCount = room.getUnreadNotificationCount();
        
        return (
          <li key={room.roomId}>
            {room.name}
            {unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
```

### Custom Unread Hook

```tsx
import { useRoom } from '@xhub-chat/react';
import { useState, useEffect } from 'react';
import { RoomEvent, NotificationCountType } from '@xhub-chat/core';

function useUnreadCount(roomId: string) {
  const room = useRoom(roomId);
  const [unreadCount, setUnreadCount] = useState(0);
  const [highlightCount, setHighlightCount] = useState(0);

  useEffect(() => {
    if (!room) return;

    const updateCounts = () => {
      setUnreadCount(room.getUnreadNotificationCount());
      setHighlightCount(
        room.getUnreadNotificationCount(NotificationCountType.Highlight)
      );
    };

    updateCounts();
    room.on(RoomEvent.UnreadNotifications, updateCounts);

    return () => {
      room.off(RoomEvent.UnreadNotifications, updateCounts);
    };
  }, [room]);

  return { unreadCount, highlightCount };
}

// Usage
function ChatHeader({ roomId }: { roomId: string }) {
  const { unreadCount, highlightCount } = useUnreadCount(roomId);

  return (
    <div>
      {unreadCount > 0 && (
        <span className="badge">{unreadCount} unread</span>
      )}
      {highlightCount > 0 && (
        <span className="badge highlight">{highlightCount} mentions</span>
      )}
    </div>
  );
}
```

### Total Unread Counter

```tsx
import { useRooms } from '@xhub-chat/react';
import { useMemo } from 'react';

function TotalUnreadBadge() {
  const rooms = useRooms();

  const totalUnread = useMemo(() => {
    return rooms.reduce((sum, room) => {
      return sum + room.getUnreadNotificationCount();
    }, 0);
  }, [rooms]);

  if (totalUnread === 0) return null;

  return (
    <div className="total-unread-badge">
      {totalUnread > 99 ? '99+' : totalUnread}
    </div>
  );
}
```

### Mark as Read on Enter

```tsx
import { useRoom, useXHubChat } from '@xhub-chat/react';
import { useEffect } from 'react';

function ChatRoom({ roomId }: { roomId: string }) {
  const room = useRoom(roomId);

  useEffect(() => {
    if (room) {
      // Mark room as read when user enters
      room.goIntoRoom();

      // Mark as left when component unmounts
      return () => {
        room.goOutRoom();
      };
    }
  }, [room]);

  return <div>{/* Chat UI */}</div>;
}
```

### Favicon Badge (Browser Notification)

```tsx
import { useRooms } from '@xhub-chat/react';
import { useEffect, useMemo } from 'react';

function FaviconBadge() {
  const rooms = useRooms();

  const totalUnread = useMemo(() => {
    return rooms.reduce((sum, room) => 
      sum + room.getUnreadNotificationCount(), 0
    );
  }, [rooms]);

  useEffect(() => {
    // Update document title
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) XHub Chat`;
    } else {
      document.title = 'XHub Chat';
    }

    // Update favicon with badge (implementation depends on your setup)
    updateFaviconBadge(totalUnread);
  }, [totalUnread]);

  return null;
}

function updateFaviconBadge(count: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  if (ctx && count > 0) {
    // Draw badge
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(24, 8, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw count
    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(count > 9 ? '9+' : count.toString(), 24, 11);
  }

  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  if (link) {
    link.href = canvas.toDataURL();
  }
}
```

## API Reference

### Room Methods

```typescript
// Get unread count
getUnreadNotificationCount(type?: NotificationCountType): number

// Set unread count
setUnreadNotificationCount(type: NotificationCountType, count: number): void

// Mark as read
goIntoRoom(): void
goOutRoom(): void
```

### Notification Types

```typescript
enum NotificationCountType {
  Total = 'total',      // All unread messages
  Highlight = 'highlight' // Only mentions/highlights
}
```

### Events

```typescript
// Listen to unread changes
room.on(RoomEvent.UnreadNotifications, (counts) => {
  console.log(counts.total, counts.highlight);
});
```

[Back to Features](/docs/features/)
