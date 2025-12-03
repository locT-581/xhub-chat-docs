---
sidebar_position: 2
title: My Reels
description: Manage and display user's own reels
tags: [reels, my-reels, user-content, filtering, pagination]
---

# 👤 My Reels

Fetch and display the current user's own reels with filtering, sorting, and pagination capabilities.

## ✨ Overview

The My Reels feature allows users to:

- **📋 View Own Content** - Display all reels created by the current user
- **🔍 Filter by Status** - Filter by approval status (approved, pending, rejected)
- **🎯 Filter by Privacy** - Filter by privacy level
- **🔄 Sort & Order** - Sort by field with ascending/descending order
- **📄 Pagination** - Load more reels with cursor-based pagination
- **⚡ Dynamic Updates** - Reload with new filters instantly

## 🎯 Use Cases

### Creator Dashboard
Display user's own reels with management controls:
```tsx
<MyReelsDashboard 
  showFilters 
  allowEdit 
  allowDelete 
/>
```

### Profile Page
Show user's published reels:
```tsx
<MyReelsGrid 
  filter={{ approving_status: 'approved' }}
  sortBy="created_at"
  order="desc"
/>
```

### Drafts & Pending Review
Show unpublished or pending reels:
```tsx
<PendingReels 
  filter={{ approving_status: 'pending' }}
/>
```

---

## 📦 Core Package (@xhub-chat/core)

### Basic Usage

```typescript
import { createClient } from '@xhub-chat/core';

const client = createClient({
  baseUrl: 'https://your-server.com',
  accessToken: 'your-access-token',
  userId: '@user:server.com',
});

await client.startClient();

// Fetch my reels with default options
const result = await client.fetchMyReels();

console.log('My reels:', result.reels);
console.log('Has more:', result.hasMore);
console.log('Next cursor:', result.nextCursor);
```

### With Filters

```typescript
// Filter by approval status
const approvedReels = await client.fetchMyReels({
  approving_status: 'approved',
  limit: 20,
});

// Filter by multiple criteria
const filteredReels = await client.fetchMyReels({
  approving_status: 'approved',
  privacy: 1,
  sort: 'created_at',
  sorted: 'desc',
  limit: 10,
});
```

### Pagination

```typescript
// First page
const firstPage = await client.fetchMyReels({ limit: 10 });

// Load more with cursor
if (firstPage.hasMore && firstPage.nextCursor) {
  const secondPage = await client.fetchMyReels({
    cursor: firstPage.nextCursor,
    limit: 10,
  });
  
  const allReels = [...firstPage.reels, ...secondPage.reels];
}
```

### API Reference

#### `fetchMyReels(options?: MyReelsFilter): Promise<MyReelsResponse>`

Fetch the current user's reels.

**Parameters:**

```typescript
interface MyReelsFilter {
  // Filter by approval status
  approving_status?: 'approved' | 'rejected' | 'pending';
  
  // Filter by privacy level
  privacy?: number;
  
  // Sort by field name
  sort?: string;
  
  // Sort order
  sorted?: 'asc' | 'desc';
  
  // Pagination cursor
  cursor?: string;
  
  // Number of items per page (default: 10)
  limit?: number;
}
```

**Returns:**

```typescript
interface MyReelsResponse {
  // Array of reel data
  reels: ReelData[];
  
  // Cursor for next page (null if no more)
  nextCursor: string | null;
  
  // Whether more reels are available
  hasMore: boolean;
}
```

**Reel Data Structure:**

```typescript
interface ReelData {
  id: string;
  title: string;
  type: string;
  description: string;
  owner_id: string;
  content: string;
  
  // Media files
  media: { type: string; url: string }[];
  thumbnail?: { type: string; url: string };
  
  // Metadata
  tags: string[];
  status: string;
  approving_status?: 'approved' | 'rejected' | 'pending';
  participants: string[] | null;
  is_allow_comment: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  scheduled_at: string | null;
  
  // Owner info
  owner?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  
  // Stats
  likes: number;
  views: number;
  total_comments: number;
  liked: boolean;
}
```

---

## ⚛️ React Package (@xhub-chat/react)

### Basic Usage

```tsx
import { useMyReels } from '@xhub-chat/react';

function MyReelsPage() {
  const { reels, loading, error, hasMore, loadMore } = useMyReels();

  if (loading && reels.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>My Reels ({reels.length})</h1>
      
      <div className="reels-grid">
        {reels.map(reel => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### With Filters

```tsx
import { useMyReels } from '@xhub-chat/react';

function MyApprovedReels() {
  const { reels, loading, setFilters, reload } = useMyReels({
    initialFilters: {
      approving_status: 'approved',
      sort: 'created_at',
      sorted: 'desc',
    },
  });

  const handleFilterChange = (status: 'approved' | 'pending' | 'rejected') => {
    setFilters({ approving_status: status });
  };

  return (
    <div>
      <div className="filters">
        <button onClick={() => handleFilterChange('approved')}>
          Approved
        </button>
        <button onClick={() => handleFilterChange('pending')}>
          Pending
        </button>
        <button onClick={() => handleFilterChange('rejected')}>
          Rejected
        </button>
      </div>
      
      <ReelsList reels={reels} loading={loading} />
    </div>
  );
}
```

### Custom Limit & Manual Load

```tsx
function MyReelsCustom() {
  const { reels, loadMore, reload } = useMyReels({
    autoLoad: false,  // Don't auto-load on mount
    limit: 20,        // Load 20 items per page
  });

  return (
    <div>
      <button onClick={() => reload()}>Load My Reels</button>
      
      {reels.length > 0 && (
        <>
          <ReelsList reels={reels} />
          <button onClick={loadMore}>Load More</button>
        </>
      )}
    </div>
  );
}
```

### Complete Example with All Features

```tsx
import { useMyReels } from '@xhub-chat/react';
import { useState } from 'react';

function MyReelsDashboard() {
  const [filters, setLocalFilters] = useState({
    approving_status: 'approved' as const,
    sort: 'created_at',
    sorted: 'desc' as const,
  });

  const {
    reels,
    loading,
    error,
    hasMore,
    loadMore,
    reload,
    setFilters: updateFilters,
  } = useMyReels({
    initialFilters: filters,
    limit: 12,
  });

  const handleApplyFilters = () => {
    updateFilters(filters);
  };

  const handleRefresh = () => {
    reload(filters);
  };

  return (
    <div className="dashboard">
      {/* Filter Controls */}
      <div className="filters">
        <select
          value={filters.approving_status}
          onChange={(e) => setLocalFilters({
            ...filters,
            approving_status: e.target.value as any,
          })}
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.sorted}
          onChange={(e) => setLocalFilters({
            ...filters,
            sorted: e.target.value as 'asc' | 'desc',
          })}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>

        <button onClick={handleApplyFilters}>Apply Filters</button>
        <button onClick={handleRefresh}>Refresh</button>
      </div>

      {/* Error State */}
      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}

      {/* Reels Grid */}
      <div className="reels-grid">
        {reels.map(reel => (
          <div key={reel.id} className="reel-card">
            <img src={reel.thumbnail?.url} alt={reel.title} />
            <h3>{reel.title}</h3>
            <div className="stats">
              <span>❤️ {reel.likes}</span>
              <span>👁️ {reel.views}</span>
              <span>💬 {reel.total_comments}</span>
            </div>
            <div className="status">
              Status: {reel.approving_status}
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && <div className="loading">Loading...</div>}

      {/* Empty State */}
      {!loading && reels.length === 0 && (
        <div className="empty">No reels found</div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <button onClick={loadMore} className="load-more">
          Load More Reels
        </button>
      )}

      {/* Total Count */}
      <div className="summary">
        Showing {reels.length} reels
      </div>
    </div>
  );
}
```

### Hook API Reference

#### `useMyReels(options?: UseMyReelsOptions): UseMyReelsReturn`

React hook for managing user's own reels with filtering and pagination.

**Options:**

```typescript
interface UseMyReelsOptions {
  // Auto-load reels on mount (default: true)
  autoLoad?: boolean;
  
  // Number of items per page (default: 10)
  limit?: number;
  
  // Initial filter values
  initialFilters?: MyReelsFilter;
}
```

**Returns:**

```typescript
interface UseMyReelsReturn {
  // Array of loaded reels
  reels: ReelData[];
  
  // Loading state
  loading: boolean;
  
  // Error if any
  error: Error | null;
  
  // Whether more reels are available
  hasMore: boolean;
  
  // Current filters
  filters: MyReelsFilter;
  
  // Load next page of reels
  loadMore: () => Promise<void>;
  
  // Reload from start with optional new filters
  reload: (newFilters?: MyReelsFilter) => Promise<void>;
  
  // Update filters and trigger reload
  setFilters: (newFilters: MyReelsFilter) => void;
}
```

---

## 🎨 Real-World Scenarios

### Creator Studio

```tsx
function CreatorStudio() {
  const { reels, setFilters } = useMyReels({
    initialFilters: { approving_status: 'approved' },
  });

  return (
    <div>
      <h1>My Published Reels</h1>
      <Tabs>
        <Tab onClick={() => setFilters({ approving_status: 'approved' })}>
          Published
        </Tab>
        <Tab onClick={() => setFilters({ approving_status: 'pending' })}>
          Under Review
        </Tab>
        <Tab onClick={() => setFilters({ approving_status: 'rejected' })}>
          Rejected
        </Tab>
      </Tabs>
      <ReelsGrid reels={reels} editable />
    </div>
  );
}
```

### Analytics Dashboard

```tsx
function AnalyticsDashboard() {
  const { reels } = useMyReels({
    initialFilters: {
      approving_status: 'approved',
      sort: 'views',
      sorted: 'desc',
    },
  });

  const totalViews = reels.reduce((sum, reel) => sum + reel.views, 0);
  const totalLikes = reels.reduce((sum, reel) => sum + reel.likes, 0);

  return (
    <div>
      <h1>Content Performance</h1>
      <Stats>
        <Stat label="Total Reels" value={reels.length} />
        <Stat label="Total Views" value={totalViews} />
        <Stat label="Total Likes" value={totalLikes} />
      </Stats>
      <TopPerformingReels reels={reels.slice(0, 5)} />
    </div>
  );
}
```

---

## ⚡ Performance Tips

### Optimize Re-renders

```tsx
import { memo } from 'react';

const ReelCard = memo(({ reel }: { reel: ReelData }) => {
  return (
    <div className="reel-card">
      {/* Card content */}
    </div>
  );
});
```

### Virtual Scrolling for Large Lists

```tsx
import { useMyReels } from '@xhub-chat/react';
import { FixedSizeList } from 'react-window';

function VirtualizedReelsList() {
  const { reels, loadMore, hasMore } = useMyReels({ limit: 100 });

  return (
    <FixedSizeList
      height={600}
      itemCount={reels.length}
      itemSize={200}
      onItemsRendered={({ visibleStopIndex }) => {
        if (visibleStopIndex >= reels.length - 5 && hasMore) {
          loadMore();
        }
      }}
    >
      {({ index, style }) => (
        <div style={style}>
          <ReelCard reel={reels[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

## 🔧 Troubleshooting

### Reels Not Loading

**Problem:** `reels` array is empty even after loading.

**Solution:**
- Ensure user is authenticated with valid `accessToken`
- Check that `client.startClient()` was called
- Verify API endpoint is accessible

```tsx
const { reels, error } = useMyReels();

if (error) {
  console.error('Failed to load reels:', error);
}
```

### Filters Not Working

**Problem:** Setting filters doesn't update the list.

**Solution:** Use `setFilters()` which automatically triggers reload:

```tsx
// ✅ Correct
setFilters({ approving_status: 'approved' });

// ❌ Wrong - this won't trigger reload
const { filters } = useMyReels();
filters.approving_status = 'approved';
```

### Duplicate Reels After Pagination

**Problem:** Same reels appear multiple times.

**Solution:** The hook automatically prevents duplicate calls. Ensure you're not calling `loadMore()` multiple times simultaneously:

```tsx
// ✅ Correct
<button onClick={loadMore} disabled={loading}>
  Load More
</button>

// ❌ Wrong - can cause duplicates
<button onClick={() => {
  loadMore();
  loadMore(); // Don't call twice!
}}>
  Load More
</button>
```

---

## 📚 Related Documentation

- [Reels Feed](./reels-feed) - Display public reels feed
- [Reel Player](./reel-player) - Play individual reels
- [Reel Comments](./reel-comments) - Manage reel comments
- [useXHubChat Hook](../../api/hooks#usexhubchat) - Access XHub client

---

## 🎯 Next Steps

- **[Create Reel](#)** - Learn how to upload and create new reels
- **[Edit Reel](#)** - Update reel metadata and settings
- **[Delete Reel](#)** - Remove reels from your account
- **[Reel Analytics](#)** - Track performance metrics
