---
sidebar_position: 1
title: Reels Feed
description: Display reels list with infinite scroll
tags: [reels, feed, infinite-scroll, pagination]
---

# 📱 Reels Feed

Display reels list with infinite scroll, similar to TikTok For You page.

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

// Load initial reels
await client.paginateReels({ limit: 10 });

// Get loaded reels
const reelsStore = client.getReelsStore();
const rooms = await reelsStore.getSavedRooms();

// Extract reel data
const reels = rooms
  .map(room => room.reel)
  .filter(reel => reel !== undefined);

console.log('Loaded reels:', reels.length);
```

### Pagination

```typescript
// Check if more reels available
if (client.canPaginateReels()) {
  // Load more reels
  await client.paginateReels({ limit: 10 });
  
  // Get updated list
  const rooms = await reelsStore.getSavedRooms();
}
```

### Refresh Feed

```typescript
// Clear cache and reload from start
client.clearReelCache();
await client.paginateReels({ limit: 10 });
```

### Reel Data Structure

```typescript
interface ReelData {
  id: string;
  title: string;
  type: string;
  description: string;
  owner_id: string;
  content: string;
  
  // Media files (HLS video URLs)
  media: { type: string; url: string }[];
  thumbnail?: { type: string; url: string };
  
  // Metadata
  tags: string[];
  status: string;
  participants: string[] | null;
  is_allow_comment: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  scheduled_at: string | null;
  
  // Owner/Creator info
  owner?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  
  // Stats
  likes: number;
  dislikes?: number;
  views: number;
  total_comments: number;
  
  // User interactions
  liked: boolean;
}
```

## React Package (@xhub-chat/react)

### Basic Usage

```tsx
import { useReelsFeed } from '@xhub-chat/react';

function ReelsFeed() {
  const { reels, loading, error } = useReelsFeed({ limit: 10 });

  if (loading) return <div>Loading reels...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {reels.map(reel => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
}

function ReelCard({ reel }: { reel: ReelData }) {
  const videoUrl = reel.media?.[0]?.url;
  const posterUrl = reel.thumbnail?.url;
  const creatorName = reel.owner 
    ? `${reel.owner.first_name} ${reel.owner.last_name}` 
    : 'Unknown';
  
  return (
    <div className="reel-card">
      <video src={videoUrl} poster={posterUrl} />
      <h3>{reel.title}</h3>
      <p>{creatorName}</p>
      <div className="stats">
        <span>❤️ {reel.likes}</span>
        <span>👁️ {reel.views}</span>
        <span>💬 {reel.total_comments}</span>
      </div>
    </div>
  );
}
```

### Infinite Scroll

```tsx
import { useReelsFeed } from '@xhub-chat/react';
import { useEffect, useRef } from 'react';

function InfiniteReelsFeed() {
  const { 
    reels, 
    loading, 
    fetching,     // Loading more reels
    hasMore, 
    loadMore 
  } = useReelsFeed({ limit: 10 });
  
  const observerRef = useRef<IntersectionObserver>();
  const lastReelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetching || !hasMore) return;

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (lastReelRef.current) {
      observerRef.current.observe(lastReelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [fetching, hasMore, loadMore]);

  return (
    <div className="feed">
      {reels.map((reel, index) => (
        <div
          key={reel.id}
          ref={index === reels.length - 1 ? lastReelRef : null}
        >
          <ReelCard reel={reel} />
        </div>
      ))}
      {fetching && <div>Loading more...</div>}
      {!hasMore && <div>No more reels</div>}
    </div>
  );
}
```

### Pull to Refresh

```tsx
import { useReelsFeed } from '@xhub-chat/react';

function RefreshableReelsFeed() {
  const { 
    reels, 
    loading,
    refreshing,   // Refreshing state
    refresh 
  } = useReelsFeed({ limit: 10 });

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <div>
      <button 
        onClick={handleRefresh} 
        disabled={refreshing}
      >
        {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
      </button>
      
      {loading && <div>Initial loading...</div>}
      
      <div className="feed">
        {reels.map(reel => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
}
```

### Loading States

The `useReelsFeed` hook provides 3 different loading states:

```tsx
function ReelsFeedWithStates() {
  const { 
    reels,
    loading,      // true when initial loading
    fetching,     // true when loading more (pagination)
    refreshing,   // true when refreshing
    loadMore,
    refresh,
    hasMore
  } = useReelsFeed({ limit: 10 });

  return (
    <div>
      {/* Initial loading spinner */}
      {loading && reels.length === 0 && (
        <div className="initial-loader">
          <Spinner size="large" />
        </div>
      )}

      {/* Reels list */}
      <div className="reels-list">
        {reels.map(reel => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>

      {/* Load more indicator */}
      {fetching && (
        <div className="load-more-indicator">
          <Spinner size="small" /> Loading more...
        </div>
      )}

      {/* Refresh indicator */}
      {refreshing && (
        <div className="refresh-overlay">
          <Spinner /> Refreshing...
        </div>
      )}

      {/* Load more button */}
      {hasMore && !fetching && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

### Advanced: Custom Options

```tsx
function CustomReelsFeed() {
  const { reels } = useReelsFeed({
    limit: 20,                    // Load 20 reels per page
    autoLoad: true,               // Auto-load on mount (default)
    clearCacheOnUnmount: true,    // Clear cache when unmount (default)
  });

  return <div>{/* ... */}</div>;
}
```

### Advanced: Manual Control

```tsx
function ManualReelsFeed() {
  const { reels, loadMore } = useReelsFeed({
    autoLoad: false,  // Don't load on mount
  });

  const handleLoadReels = () => {
    loadMore(); // Manual trigger
  };

  return (
    <div>
      <button onClick={handleLoadReels}>Load Reels</button>
      {reels.map(reel => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
}
```

## API Reference

### Hook: `useReelsFeed`

```typescript
function useReelsFeed(options?: IUseReelsFeedOptions): IUseReelsFeed;

interface IUseReelsFeedOptions {
  /** Number of reels to load per page (default: 10) */
  limit?: number;
  /** Whether to auto-load initial feed on mount (default: true) */
  autoLoad?: boolean;
  /** Whether to clear cache on unmount (default: true) */
  clearCacheOnUnmount?: boolean;
}

interface IUseReelsFeed {
  /** Array of reels loaded so far */
  reels: ReelData[];
  /** Whether currently loading reels (initial load) */
  loading: boolean;
  /** Whether currently fetching more reels (load more) */
  fetching: boolean;
  /** Whether currently refreshing the feed */
  refreshing: boolean;
  /** Error if fetch failed */
  error: Error | null;
  /** Load more reels (for infinite scroll) */
  loadMore: () => Promise<void>;
  /** Whether more reels are available to load */
  hasMore: boolean;
  /** Manually refresh the feed (clears and reloads from start) */
  refresh: () => Promise<void>;
}
```

### Client Methods

```typescript
// Core package methods
client.paginateReels({ limit: number }): Promise<void>
client.canPaginateReels(): boolean
client.clearReelCache(): void
client.getReelsStore(): EphemeralStore | undefined
```

## Best Practices

### 1. Memory Management

Reels are stored in memory (EphemeralStore), so proper management is needed:

```tsx
// ✅ Good: Auto-cleanup on unmount
function ReelsFeed() {
  const { reels } = useReelsFeed({
    clearCacheOnUnmount: true  // Default
  });
  return <div>{/* ... */}</div>;
}

// ❌ Bad: Keep cache forever
function ReelsFeed() {
  const { reels } = useReelsFeed({
    clearCacheOnUnmount: false
  });
  return <div>{/* ... */}</div>;
}
```

### 2. Pagination Strategy

```tsx
// ✅ Good: Load reasonable batch size
const { reels } = useReelsFeed({ limit: 10 });

// ❌ Bad: Load too many at once
const { reels } = useReelsFeed({ limit: 100 });
```

### 3. Error Handling

```tsx
function ReelsFeed() {
  const { reels, error, refresh } = useReelsFeed();

  if (error) {
    return (
      <div className="error">
        <p>Failed to load reels: {error.message}</p>
        <button onClick={refresh}>Try Again</button>
      </div>
    );
  }

  return <div>{/* ... */}</div>;
}
```

### 4. Loading States

```tsx
// ✅ Good: Show appropriate loading UI
function ReelsFeed() {
  const { reels, loading, fetching, refreshing } = useReelsFeed();

  return (
    <div>
      {loading && <InitialLoader />}
      {refreshing && <RefreshOverlay />}
      {reels.map(reel => <ReelCard key={reel.id} reel={reel} />)}
      {fetching && <LoadMoreSpinner />}
    </div>
  );
}

// ❌ Bad: No loading feedback
function ReelsFeed() {
  const { reels } = useReelsFeed();
  return <div>{reels.map(reel => <ReelCard key={reel.id} reel={reel} />)}</div>;
}
```

## Related

- [Reel Player](./reel-player) - Play video and interact with reel
- [Reel Comments](./reel-comments) - View and send comments

[Back to Reels Features](/docs/features/reels/)
