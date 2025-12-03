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

## useReelsFeed

Load and paginate reels feed (TikTok-style).

```typescript
const { 
  reels, 
  loading, 
  fetching, 
  refreshing,
  hasMore, 
  loadMore, 
  refresh,
  error 
} = useReelsFeed({ limit: 10 });
```

**Options:**

```typescript
interface IUseReelsFeedOptions {
  limit?: number;                    // Reels per page (default: 10)
  autoLoad?: boolean;                // Auto-load on mount (default: true)
  clearCacheOnUnmount?: boolean;     // Clear cache on unmount (default: true)
}
```

**Returns:**

```typescript
interface IUseReelsFeed {
  reels: ReelData[];                 // Array of loaded reels
  loading: boolean;                  // Initial load state
  fetching: boolean;                 // Load more state
  refreshing: boolean;               // Refresh state
  error: Error | null;               // Error if any
  loadMore: () => Promise<void>;     // Load more reels
  hasMore: boolean;                  // Whether more reels available
  refresh: () => Promise<void>;      // Refresh feed
}
```

**Example:**

```tsx
import { useReelsFeed } from '@xhub-chat/react';

function ReelsFeed() {
  const { reels, loading, fetching, hasMore, loadMore } = useReelsFeed({ 
    limit: 10 
  });

  return (
    <div>
      {reels.map(reel => <ReelCard key={reel.id} reel={reel} />)}
      {fetching && <Spinner />}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

[Learn more about Reels Feed →](/docs/features/reels/reels-feed)

## useReelRoom

Get Room instance for a specific reel.

```typescript
const { room, loading, error, isReelRoom } = useReelRoom(reelId);
```

**Parameters:**
- `reelId: string` - The reel ID

**Returns:**

```typescript
interface IUseReelRoom {
  room: Room | null;                 // Room instance
  loading: boolean;                  // Loading state
  error: Error | null;               // Error if any
  isReelRoom: boolean;               // Whether it's a valid reel room
}
```

**Example:**

```tsx
import { useReelRoom } from '@xhub-chat/react';

function ReelPlayer({ reelId }: { reelId: string }) {
  const { room, loading, isReelRoom } = useReelRoom(reelId);

  if (loading) return <Spinner />;
  if (!room || !isReelRoom) return <NotFound />;

  const reel = room.getReelData();
  const videoUrl = reel.media?.[0]?.url;
  const posterUrl = reel.thumbnail?.url;
  
  return <video src={videoUrl} poster={posterUrl} controls />;
}
```

:::warning
`useReelRoom` only retrieves from cache. Must load reels with `useReelsFeed` first!
:::

[Learn more about Reel Player →](/docs/features/reels/reel-player)

## useReelComments

Get comments for a specific reel.

```typescript
const { comments, loading, error, sendComment } = useReelComments(reelId);
```

**Parameters:**
- `reelId: string` - The reel ID

**Returns:**

```typescript
interface IUseReelComments {
  comments: CommentData[];           // Array of comments
  loading: boolean;                  // Loading state
  error: Error | null;               // Error if any
  sendComment: (text: string) => Promise<void>;  // Send comment
  refresh: () => void;               // Refresh comments
}
```

**Example:**

```tsx
import { useReelComments } from '@xhub-chat/react';

function ReelComments({ reelId }: { reelId: string }) {
  const { comments, sendComment } = useReelComments(reelId);
  const [text, setText] = useState('');

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>{comment.content.body}</div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendComment(text);
        setText('');
      }}>
        <input value={text} onChange={e => setText(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}
```

[Learn more about Reel Comments →](/docs/features/reels/reel-comments)

[Back to React Package](/docs/packages/react/)
