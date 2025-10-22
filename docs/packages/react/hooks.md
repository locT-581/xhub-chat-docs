---
sidebar_position: 2
title: React Hooks Reference
description: Complete reference for all React hooks
tags: [react, hooks, api]
---

# 🎣 React Hooks Reference

Complete API reference for all `@xhub-chat/react` hooks.

## useXHubChat

Access the XHubChat client instance.

```typescript
const client = useXHubChat();
```

**Returns:** `XHubChatClient | null`

## useRooms

Get all rooms.

```typescript
const rooms = useRooms();
```

**Returns:** `Room[]`

**Options:**

```typescript
useRooms({
  filter?: (room: Room) => boolean;
})
```

## useRoom

Get a specific room.

```typescript
const room = useRoom(roomId);
```

**Parameters:**
- `roomId: string` - The room ID

**Returns:** `Room | null`

## useTimeline

Get timeline events for a room.

```typescript
const { events, loading } = useTimeline(roomId);
```

**Returns:**

```typescript
{
  events: MatrixEvent[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}
```

[Back to React Package](/docs/packages/react/)
