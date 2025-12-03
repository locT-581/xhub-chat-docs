---
sidebar_position: 2
title: Core API Reference
description: Complete API reference for @xhub-chat/core
tags: [core, api, reference]
---

# 📖 Core API Reference

Complete API documentation for `@xhub-chat/core` package.

## Main Classes

### XHubChatClient

The main client class that provides all chat functionality.

#### Constructor

```typescript
createClient(opts: ICreateClientOpts): XHubChatClient
```

**Parameters:**

```typescript
interface ICreateClientOpts {
  baseUrl: string;          // Server URL
  accessToken: string;      // Authentication token
  userId: string;           // User ID
  store?: IStoreOpts;       // Storage configuration
  sync?: ISyncOpts;         // Sync configuration
  timelineSupport?: boolean;
  cryptoEnabled?: boolean;
}
```

#### Methods

**Connection**

- `startClient(opts?: IStartClientOpts): Promise<void>` - Start the client
- `stopClient(): Promise<void>` - Stop the client  
- `destroy(): Promise<void>` - Destroy and cleanup

**Rooms**

- `getRoom(roomId: string): Room | null` - Get room by ID
- `getRooms(): Room[]` - Get all rooms
- `joinRoom(roomId: string): Promise<void>` - Join a room
- `leaveRoom(roomId: string): Promise<void>` - Leave a room

**Messaging**

- `sendTextMessage(roomId: string, text: string): Promise<void>` - Send text message
- `sendMessage(roomId: string, content: any): Promise<void>` - Send custom message
- `resendEvent(event: Event): Promise<void>` - Resend failed event

**Reels**

- `paginateReels(opts?: { limit?: number }): Promise<void>` - Load more reels from feed
- `canPaginateReels(): boolean` - Check if more reels available
- `clearReelCache(): void` - Clear reels cache
- `fetchMyReels(filter?: MyReelsFilter): Promise<MyReelsResponse>` - Fetch user's own reels

**Events**

- `on(event: string, handler: Function): void` - Register event listener
- `off(event: string, handler: Function): void` - Remove event listener
- `once(event: string, handler: Function): void` - One-time event listener

---

## Reels API

### fetchMyReels

Fetch the current user's own reels with filtering and pagination.

**Signature:**

```typescript
fetchMyReels(filter?: MyReelsFilter): Promise<MyReelsResponse>
```

**Parameters:**

```typescript
interface MyReelsFilter {
  approving_status?: 'approved' | 'rejected' | 'pending';
  privacy?: number;
  sort?: string;
  sorted?: 'asc' | 'desc';
  cursor?: string;
  limit?: number;  // default: 10
}
```

**Returns:**

```typescript
interface MyReelsResponse {
  reels: ReelData[];
  nextCursor: string | null;
  hasMore: boolean;
}
```

**Example:**

```typescript
// Fetch approved reels
const { reels, nextCursor, hasMore } = await client.fetchMyReels({
  approving_status: 'approved',
  limit: 20,
});

// Load next page
if (hasMore && nextCursor) {
  const nextPage = await client.fetchMyReels({
    cursor: nextCursor,
    limit: 20,
  });
}
```

**See Also:**

- [My Reels Guide](/docs/features/reels/my-reels) - Complete guide with examples
- [useMyReels Hook](/docs/api/hooks#usemyreels) - React hook wrapper

---

[Back to Core Package](/docs/packages/core/)
